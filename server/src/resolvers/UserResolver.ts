import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { User } from '../entities/User';
import { protect } from '../middlewares/permissions';
import { MyContext } from '../types/globalTypes';
import { LoginInput, RegisterInput, UserResponse } from '../types/UserTypes';
import { setToken } from '../utils/jwtHelper';
import validateEntity from '../utils/validationHelpers';

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  @UseMiddleware(protect({ strict: true }))
  allUsers() {
    return User.find();
  }

  @Query(() => User, { nullable: false })
  @UseMiddleware(protect({ strict: false }))
  me(@Ctx() { res, userLoader }: MyContext) {
    return res.locals.userId ? userLoader.load(res.locals.userId) : null;
  }

  @Query(() => User, { nullable: false })
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
      console.log('made it here');
      const { errors } = await validateEntity(newUser);
      if (errors) return { errors };
      await newUser.save();
      return { user: newUser, token: setToken(newUser) };
    } catch (err) {
      console.log(err);
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
      console.log(err);
      return { errors: [{ field: 'unknown', message: err.message }] };
    }
  }
}
