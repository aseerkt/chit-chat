import { Ctx, FieldResolver, Mutation, Resolver, Root } from 'type-graphql';
import { Member } from '../../entities/Member';
import { User } from '../../entities/User';
import { MyContext } from '../../types/global.types';

@Resolver(Member)
export class MemberResolver {
  @FieldResolver(() => User)
  user(@Root() member: Member, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(member.userId);
  }

  // TODO: Add member to room
  // TODO: Leave Room
  // TODO: Kick member from room

  @Mutation(() => Boolean)
  addMembers() {}

  @Mutation(() => Boolean)
  kickMembers() {}
}
