import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Publisher,
  PubSub,
  Query,
  Resolver,
  Root,
  Subscription,
  UseMiddleware,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Message } from '../entities/Message';
import { Member } from '../entities/Member';
import { Room, RoomType } from '../entities/Room';
import { hasRoomAccess, protect } from '../middlewares/permissions';
import { Errors, MyContext } from '../types/globalTypes';
import { CreateRoomResponse } from './RoomResolver';

@ObjectType()
export class SendMessageResponse extends Errors {
  @Field(() => Message, { nullable: true })
  message?: Message;
}

@Resolver()
export class DMResolver {
  @Query(() => [Room])
  @UseMiddleware(protect({ strict: true }))
  getDMRooms(@Ctx() { res }: MyContext) {
    return getConnection().query(
      `SELECT r.* FROM rooms r
        LEFT JOIN messages msg ON msg."roomId" = r.id
        LEFT JOIN members m ON m."roomId" = r.id
        WHERE
          r.type = 'DM'
          AND m."userId" = $1
          `,
      [res.locals.userId]
    );
  }

  @Query(() => [Message])
  @UseMiddleware(protect({ strict: true }))
  @UseMiddleware(hasRoomAccess)
  getDMMessages(@Arg('roomId', () => Int) roomId: number) {
    return Message.find({ where: { roomId } });
  }

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
      LEFT JOIN members m
      ON r.id = m."roomId"
      WHERE r.type = 'DM' AND m."userId" IN ($1, $2)
      LIMIT 1;
    `,
      [res.locals.userId, recieverId]
    );

    console.log({ results });
    if (results.length !== 0) {
      return { room: results[0] };
    }
    const newRoom = await getConnection().transaction(async (tem) => {
      const newRoom = await tem.create(Room, { type: RoomType.DM }).save();
      await tem
        .create(Member, {
          userId: res.locals.userId,
          roomId: newRoom.id,
        })
        .save();
      await tem
        .create(Member, {
          userId: recieverId,
          roomId: newRoom.id,
        })
        .save();
      return newRoom;
    });
    console.log(newRoom);
    return { room: newRoom };
  }

  @Mutation(() => SendMessageResponse)
  @UseMiddleware(protect({ strict: true }))
  @UseMiddleware(hasRoomAccess)
  async sendDM(
    @Arg('roomId', () => Int) roomId: number,
    @Arg('text') text: string,
    @Ctx() { res }: MyContext,
    @PubSub('NEW_MESSAGE') publish: Publisher<Message>
  ): Promise<SendMessageResponse> {
    const message = await Message.create({
      roomId: roomId,
      text,
      senderId: res.locals.userId,
    }).save();
    await publish(message);
    return { message };
  }

  @Subscription({
    topics: 'NEW_MESSAGE',
    filter: ({ args, payload }) => args.roomId === payload.roomId,
  })
  getNewMessage(
    @Root() msgPayload: Message,
    @Arg('roomId', () => Int) roomId: number
  ): Message {
    console.log(roomId);
    return msgPayload;
  }
}
