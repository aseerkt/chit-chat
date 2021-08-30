import { Mutation, UseMiddleware, Arg, Int } from 'type-graphql';
import { getConnection } from 'typeorm';
import { Member } from '../entities/Member';
import { Room, RoomType } from '../entities/Room';
import { protect } from '../middlewares/permissions';
import { CreateRoomResponse } from './RoomResolver';

export class GroupResolver {
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
