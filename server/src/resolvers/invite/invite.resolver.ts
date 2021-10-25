import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { Invite } from '../../entities/Invite';
import { Member, MemberRole } from '../../entities/Member';
import { User } from '../../entities/User';
import { protect } from '../../middlewares/permissions';
import { MyContext } from '../../types/global.types';

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

  @Mutation(() => Boolean)
  @UseMiddleware(protect({ strict: true }))
  async handleInvitation(
    @Arg('inviteId', () => Int) inviteId: number,
    @Arg('accept') accept: boolean,
    @Ctx() { res, memberLoader }: MyContext
  ) {
    const invite = await Invite.findOne({
      where: { id: inviteId, inviteeId: res.locals.userId },
    });
    if (!invite) return false;
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
    memberLoader.clear(invite.roomId);
    return true;
  }
}
