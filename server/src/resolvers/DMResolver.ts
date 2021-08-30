import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import { Member } from '../entities/Member';
import { Room, RoomType } from '../entities/Room';
import { protect } from '../middlewares/permissions';
import { MyContext } from '../types/globalTypes';
import { CreateRoomResponse } from './RoomResolver';

@Resolver()
export class DMResolver {
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
}
