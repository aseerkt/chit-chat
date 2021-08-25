import { Mutation, UseMiddleware, Arg, Int, Ctx } from 'type-graphql';
import { Room, RoomType } from '../entities/Room';
import { protect } from '../middlewares/permissions';
import { MyContext } from '../types/globalTypes';
import { CreateRoomResponse } from './RoomResolver';

export class GroupResolver {
  @Mutation(() => CreateRoomResponse)
  @UseMiddleware(protect({ strict: true }))
  async createGroupRoom(
    @Arg('name') name: string,
    @Arg('members', () => [Int]) members: number[],
    @Ctx() { res }: MyContext
  ): Promise<CreateRoomResponse> {
    //  Restrict partipants number
    if (members.length > 5) {
      return {
        errors: [
          {
            field: 'members',
            message: 'maximum number members reached',
          },
        ],
      };
    }
    const room = await Room.create({
      name,
      type: RoomType.GROUP,
      members: [
        { userId: res.locals.userId },
        ...members.map((id) => ({ userId: id })),
      ],
    }).save();
    return { room };
  }
}
