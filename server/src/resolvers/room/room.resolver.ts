import {
  Field,
  Resolver,
  ObjectType,
  FieldResolver,
  Root,
  Ctx,
  Query,
  UseMiddleware,
  Mutation,
  Arg,
  Int,
} from 'type-graphql';
import { getConnection, getRepository } from 'typeorm';
import { Invite } from '../../entities/Invite';
import { Member, MemberRole } from '../../entities/Member';
import { Room, RoomType } from '../../entities/Room';

import { protect } from '../../middlewares/permissions';
import { Errors, MyContext } from '../../types/global.types';

@ObjectType()
export class CreateRoomResponse extends Errors {
  @Field(() => Room, { nullable: true })
  room?: Room;

  @Field(() => [Invite], { nullable: true })
  invites?: Invite[];
}

@Resolver(Room)
export class RoomResolver {
  // Field Resolvers
  // @FieldResolver(() => [Message])
  // async messages(@Root() room: Room, @Ctx() { msgLoader }: MyContext) {
  //   const messages = await msgLoader.load(room.id);
  //   console.log(messages);
  //   return messages;
  // }

  @FieldResolver(() => [Member])
  members(@Root() room: Room, @Ctx() { memberLoader }: MyContext) {
    return memberLoader.load(room.id);
  }

  @FieldResolver(() => String)
  async name(
    @Root() room: Room,
    @Ctx() { memberLoader, userLoader, res }: MyContext
  ) {
    if (room.type === RoomType.GROUP) return room.name;
    const members = await memberLoader.load(room.id);
    const otherMemberId = members.find(
      (m) => m.userId !== res.locals.userId
    )!.userId;
    const otherMember = await userLoader.load(otherMemberId);
    return otherMember.username;
  }

  // Query Resolvers

  @Query(() => [Room])
  @UseMiddleware(protect({ strict: true }))
  async getMyRooms(@Ctx() { res }: MyContext) {
    const results = await getRepository(Room)
      .createQueryBuilder('r')
      .leftJoin('members', 'm', 'm."roomId" = r.id')
      .leftJoin('messages', 'msg', 'msg."roomId" = r.id')
      .where('m."userId" = :userId', { userId: res.locals.userId })
      .andWhere("m.\"role\" IN ('ADMIN', 'MEMBER')")
      .orderBy('msg."createdAt"', 'DESC')
      .getMany();
    return results;
  }

  // Mutation Resolvers

  @Mutation(() => CreateRoomResponse)
  @UseMiddleware(protect({ strict: true }))
  async createRoom(
    @Arg('name', { nullable: true }) name: string,
    @Arg('members', () => [Int]) members: number[],
    @Ctx() { res, userLoader }: MyContext,
    @Arg('type', () => RoomType) type: RoomType
  ): Promise<CreateRoomResponse> {
    //  Restrict partipants number
    if (type === RoomType.GROUP && (name?.length < 4 || !name))
      return { errors: [{ field: 'name', message: 'Name is too short' }] };
    if (
      (type === RoomType.DM && members.length !== 2) ||
      (type === RoomType.GROUP && members.length > 10)
    )
      return {
        errors: [
          {
            field: 'members',
            message:
              type === RoomType.DM
                ? 'member count mismatch'
                : 'maximum number members reached',
          },
        ],
      };

    if (type === RoomType.DM) {
      const results: Room[] = await getConnection().query(
        /*sql*/ `
        SELECT
            DISTINCT ON (r.id)
            *
            FROM rooms r
            WHERE r.type = 'DM' AND r.id IN (
              SELECT "roomId"
              FROM members
              GROUP BY "roomId"
              HAVING array_agg("userId" order by "userId") = array[$1::integer, $2::integer]
              )
              `,
        members.sort((m1, m2) => m1 - m2)
      );
      console.log(results);

      if (results.length !== 0) {
        return { room: results[0] };
      }
    }

    const memberUsers = await Promise.all(
      members.map((m) => userLoader.load(m))
    );

    return getConnection().transaction(async (tem) => {
      const newRoom = tem.create(Room, {
        name: type === RoomType.DM ? undefined : name,
        type,
      });
      await tem.save(newRoom);
      console.log(newRoom);

      const memberValues = tem.create(
        Member,
        memberUsers.map((u) => ({
          roomId: newRoom.id,
          userId: u.id,
          role:
            u.id === res.locals.userId
              ? type === RoomType.DM
                ? MemberRole.MEMBER
                : MemberRole.ADMIN
              : u.private
              ? MemberRole.INVITED
              : MemberRole.MEMBER,
        }))
      );
      await tem.save(memberValues);
      // Send invites to private accounts
      let invites: Invite[] | undefined;
      const privateUsers = memberUsers.filter((u) => u.private);
      if (privateUsers.length > 0) {
        const inviteEntities = tem.create(
          Invite,
          privateUsers.map((u) => ({
            inviteeId: u.id,
            inviterId: res.locals.userId,
            roomId: newRoom.id,
          }))
        );
        invites = await tem.save(inviteEntities);
      }
      return { room: newRoom, invites };
    });
  }
}
