import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { getRepository, Not } from 'typeorm';
import { Notification } from '../../entities/Notification';
import { User } from '../../entities/User';
import { protect } from '../../middlewares/permissions';
import { MyContext } from '../../types/global.types';
import {
  LoginInput,
  PaginatedUsers,
  RegisterInput,
  UserResponse,
} from './user.types';
import { setToken } from '../../utils/jwtHelper';

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => [Notification], { nullable: true })
  @UseMiddleware(protect({ strict: false }))
  notifications(@Ctx() { res }: MyContext) {
    if (!res.locals.userId) return null;
    return Notification.find({
      where: { recieverId: res.locals.userId },
      order: { createdAt: 'DESC' },
    });
  }

  @Query(() => PaginatedUsers)
  @UseMiddleware(protect({ strict: true }))
  async allUsers(
    @Arg('limit', () => Int, { nullable: true, defaultValue: 5 })
    limit: number,
    @Arg('offset', () => Int, { nullable: true }) offset: number,
    @Ctx() { res }: MyContext
  ): Promise<PaginatedUsers> {
    const users = await User.find({
      where: { id: Not(res.locals.userId) },
      take: limit + 1,
      skip: offset || 0,
    });
    return {
      nodes: users.slice(0, limit),
      hasMore: users.length === limit + 1,
    };
  }

  @Query(() => [User], { nullable: true })
  @UseMiddleware(protect({ strict: true }))
  searchUser(
    @Ctx() { res }: MyContext,
    @Arg('term') term: string
  ): Promise<User[]> | null {
    if (!term) return null;
    return getRepository(User)
      .createQueryBuilder('u')
      .where('u.id != :uid', { uid: res.locals.userId })
      .andWhere("u.username LIKE '%' || :term || '%'", { term })
      .getMany();
  }

  @Query(() => User, { nullable: false })
  @UseMiddleware(protect({ strict: false }))
  me(@Ctx() { res, userLoader }: MyContext) {
    return res.locals.userId ? userLoader.load(res.locals.userId) : null;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('registerInput') registerInput: RegisterInput
  ): Promise<UserResponse> {
    try {
      const user = await User.findOne({
        where: { username: registerInput.username },
      });

      if (user)
        return {
          errors: [{ field: 'username', message: 'Username is already taken' }],
        };

      const newUser = User.create({ ...registerInput });

      // console.log('made it here');
      await newUser.save();
      return { user: newUser, token: setToken(newUser) };
    } catch (err) {
      // console.log(err);
      return { errors: [{ field: 'unknown', message: err.message }] };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('loginInput') loginInput: LoginInput
  ): Promise<UserResponse> {
    try {
      const user = await User.findOne({
        where: { username: loginInput.username },
      });

      if (!user) {
        return {
          errors: [{ field: 'username', message: 'Incorrect username' }],
        };
      }
      if (!(await user.verifyPassword(loginInput.password))) {
        return {
          errors: [{ field: 'password', message: 'Incorrect password' }],
        };
      }
      return {
        user,
        token: setToken(user),
      };
    } catch (err) {
      // console.log(err);

      return { errors: [{ field: 'unknown', message: err.message }] };
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(protect({ strict: true }))
  async togglePrivacy(@Ctx() { res, userLoader }: MyContext): Promise<boolean> {
    const currentUser = await userLoader.load(res.locals.userId!);
    await User.update(
      { id: res.locals.userId },
      { private: !currentUser.private }
    );
    userLoader.clear(res.locals.userId!);
    return true;
  }
}
