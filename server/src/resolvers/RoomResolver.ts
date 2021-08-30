import {
  Field,
  Resolver,
  ObjectType,
  FieldResolver,
  Root,
  Ctx,
  Arg,
  Int,
  Query,
  UseMiddleware,
} from 'type-graphql';
import { getRepository } from 'typeorm';
import { Message } from '../entities/Message';
import { Room, RoomType } from '../entities/Room';
import { User } from '../entities/User';
import { protect, hasRoomAccess } from '../middlewares/permissions';
import { Errors, MyContext } from '../types/globalTypes';

@ObjectType()
export class CreateRoomResponse extends Errors {
  @Field(() => Room, { nullable: true })
  room?: Room;
}

@Resolver(Room)
export class RoomResolver {
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

  @Query(() => [Message])
  @UseMiddleware(protect({ strict: true }))
  @UseMiddleware(hasRoomAccess)
  getMessages(@Arg('roomId', () => Int) roomId: number) {
    return Message.find({ where: { roomId } });
  }
}
