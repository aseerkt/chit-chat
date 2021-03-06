import {
  Arg,
  Int,
  Mutation,
  Publisher,
  PubSub,
  Resolver,
  Subscription,
  UseMiddleware,
  Ctx,
  FieldResolver,
  Root,
  Query,
} from 'type-graphql';
import { User } from '../../entities/User';
import { Message } from '../../entities/Message';
import { protect, hasRoomAccess } from '../../middlewares/permissions';
import { MyContext } from '../../types/global.types';
import { LessThan } from 'typeorm';
import {
  NewMessagePayload,
  PaginatedMessages,
  SendMessageResponse,
} from './message.types';

// @ObjectType()
// class MessagePayload {
//   @Field()
//   actionType: 'DELETE' | 'CREATE' | 'UPDATE';
//   @Field(() => Message, { nullable: true })
//   message: Message;
// }

@Resolver(Message)
export class MessageResolver {
  @FieldResolver(() => User, { nullable: true })
  sender(@Root() message: Message, @Ctx() { userLoader }: MyContext) {
    if (!message.senderId) return null;
    return userLoader.load(message.senderId);
  }

  @Query(() => PaginatedMessages)
  @UseMiddleware(protect({ strict: true }))
  @UseMiddleware(hasRoomAccess)
  async getMessages(
    @Arg('roomId', () => Int) roomId: number,
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => Date, { nullable: true }) cursor: Date
  ): Promise<PaginatedMessages> {
    const cursorSelect = cursor
      ? { createdAt: LessThan(new Date(cursor)) }
      : {};
    const messages = await Message.find({
      where: { roomId, ...cursorSelect },
      order: { createdAt: 'DESC' },
      take: limit + 1,
    });
    return {
      nodes: messages.slice(0, limit),
      hasMore: messages.length === limit + 1,
    };
  }

  @Mutation(() => SendMessageResponse)
  @UseMiddleware(protect({ strict: true }))
  @UseMiddleware(hasRoomAccess)
  async sendMessage(
    @Arg('roomId', () => Int) roomId: number,
    @Arg('text') text: string,
    @Ctx() { res, memberLoader }: MyContext,
    @PubSub('NEW_MESSAGE') publish: Publisher<NewMessagePayload>
  ): Promise<SendMessageResponse> {
    const members = await memberLoader.load(roomId);
    const message = await Message.create({
      roomId: roomId,
      text,
      senderId: res.locals.userId,
    }).save();
    await publish({
      message,
      participants: members.map((member) => member.userId),
    });
    return { message };
  }

  @Subscription({
    topics: 'NEW_MESSAGE',
    filter: ({ payload, context }) =>
      payload.participants.includes(context.userId),
  })
  getNewMessage(@Root() msgPayload: NewMessagePayload): NewMessagePayload {
    // console.log(msgPayload);
    return msgPayload;
  }
}
