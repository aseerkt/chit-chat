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
import { Member } from '../entities/Member';
import { Message } from '../entities/Message';
import { Room, RoomType } from '../entities/Room';
import { User } from '../entities/User';
import { protect } from '../middlewares/permissions';
import { Errors, MyContext } from '../types/globalTypes';

@ObjectType()
export class CreateRoomResponse extends Errors {
  @Field(() => Room, { nullable: true })
  room?: Room;
}

@Resolver(Room)
export class RoomResolver {
  // Field Resolvers
  @FieldResolver(() => [Message])
  async messages(@Root() room: Room, @Ctx() { msgLoader }: MyContext) {
    const messages = await msgLoader.load(room.id);
    console.log(messages);
    return messages;
  }

  @FieldResolver(() => [User])
  members(@Root() room: Room, @Ctx() { memberLoader }: MyContext) {
    return memberLoader.load(room.id);
  }

  @FieldResolver(() => String)
  async name(@Root() room: Room, @Ctx() { memberLoader, res }: MyContext) {
    if (room.type === RoomType.GROUP) return room.name;
    const members = await memberLoader.load(room.id);
    return members.find((m) => m.id !== res.locals.userId)?.username;
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
      .orderBy('msg."createdAt"', 'DESC')
      .getMany();
    console.log(results);
    return results;
  }

  // Mutation Resolvers

  @Mutation(() => CreateRoomResponse)
  @UseMiddleware(protect({ strict: true }))
  async createDMRoom(
    @Arg('recieverId', () => Int) recieverId: number,
    @Ctx() { res }: MyContext
  ): Promise<CreateRoomResponse> {
    const results: Room[] = await getConnection().query(
      `
      SELECT
      DISTINCT ON (r.id)
        *
      FROM rooms r
      WHERE r.id IN (
        SELECT "roomId"
        FROM members
        GROUP BY "roomId"
        HAVING array_agg("userId" order by "userId") = array[$1::integer, $2::integer]
      )
    `,
      [res.locals.userId, recieverId]
    );

    console.log({ results });
    if (results.length !== 0) {
      return { room: results[0] };
    }
    const newRoom = await getConnection().transaction(async (tem) => {
      const newRoom = await tem.create(Room, { type: RoomType.DM }).save();
      await tem.connection
        .createQueryBuilder()
        .insert()
        .into(Member)
        .values([
          { roomId: newRoom.id, userId: res.locals.userId },
          { roomId: newRoom.id, userId: recieverId },
        ])
        .execute();
      return newRoom;
    });
    console.log(newRoom);
    return { room: newRoom };
  }

  @Mutation(() => CreateRoomResponse)
  @UseMiddleware(protect({ strict: true }))
  async createGroupRoom(
    @Arg('name') name: string,
    @Arg('members', () => [Int]) members: number[]
  ): Promise<CreateRoomResponse> {
    //  Restrict partipants number
    // if (members.length > 5) {
    //   return {
    //     errors: [
    //       {
    //         field: 'members',
    //         message: 'maximum number members reached',
    //       },
    //     ],
    //   };
    // }
    const room = await getConnection().transaction(async (tem) => {
      const newRoom = await Room.create({
        name,
        type: RoomType.GROUP,
      }).save();
      await tem.connection
        .createQueryBuilder()
        .insert()
        .into(Member)
        .values([
          ...members.map((uid) => ({ userId: uid, roomId: newRoom.id })),
        ])
        .execute();
      return newRoom;
    });
    return { room };
  }
}
