import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { Invite } from '../../entities/Invite';
import { Member, MemberRole } from '../../entities/Member';
import { User } from '../../entities/User';
import { protect } from '../../middlewares/permissions';
import { MyContext } from '../../types/global.types';
import { UserInvites } from './invite.types';

@ObjectType()
class HandleInviteResult {
  @Field()
  ok: boolean;

  @Field({ nullable: true })
  accept?: boolean;
}

@Resolver(Invite)
export class InviteResolver {
  @FieldResolver(() => User)
  inviter(@Root() invite: Invite, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(invite.inviterId);
  }

  @FieldResolver(() => User)
  invitee(@Root() invite: Invite, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(invite.inviteeId);
  }

  @Query(() => UserInvites, { nullable: true })
  @UseMiddleware(protect({ strict: false }))
  async getInvites(@Ctx() { res }: MyContext): Promise<UserInvites | null> {
    if (!res.locals.userId) return null;
    const invites = await Invite.find({
      where: [
        { inviteeId: res.locals.userId },
        { inviterId: res.locals.userId },
      ],
    });
    return {
      recieved: invites.filter((i) => i.inviteeId === res.locals.userId),
      sent: invites.filter((i) => i.inviterId === res.locals.userId),
    };
  }

  @Mutation(() => HandleInviteResult)
  @UseMiddleware(protect({ strict: true }))
  async handleInvitation(
    @Arg('inviteId', () => Int) inviteId: number,
    @Arg('accept') accept: boolean,
    @Ctx() { res, memberLoader }: MyContext
  ): Promise<HandleInviteResult> {
    const invite = await Invite.findOne({
      where: { id: inviteId, inviteeId: res.locals.userId },
    });
    if (!invite) return { ok: false };
    if (accept) {
      await Member.update(
        {
          roomId: invite.roomId,
          userId: res.locals.userId,
          role: MemberRole.INVITED,
        },
        { role: MemberRole.MEMBER }
      );
    } else {
      await Member.delete({
        roomId: invite.roomId,
        userId: res.locals.userId,
        role: MemberRole.INVITED,
      });
    }
    await invite.remove();
    memberLoader.clear(invite.roomId);
    return { ok: true, accept };
  }
}
