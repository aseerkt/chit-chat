import {
  Arg,
  Field,
  Int,
  Mutation,
  ObjectType,
  Publisher,
  PubSub,
  Resolver,
  Subscription,
  UseMiddleware,
  Ctx,
  FieldResolver,
  Root,
} from 'type-graphql';
import { User } from '../entities/User';
import { Message } from '../entities/Message';
import { protect, hasRoomAccess } from '../middlewares/permissions';
import { Errors, MyContext } from '../types/globalTypes';

@ObjectType()
export class SendMessageResponse extends Errors {
  @Field(() => Message, { nullable: true })
  message?: Message;
}

@Resolver(Message)
export class MessageResolver {
  @FieldResolver(() => User, { nullable: true })
  sender(@Root() message: Message, @Ctx() { userLoader }: MyContext) {
    if (!message.senderId) return null;
    if (message.sender) return message.sender;
    return userLoader.load(message.senderId);
  }

  @Mutation(() => SendMessageResponse)
  @UseMiddleware(protect({ strict: true }))
  @UseMiddleware(hasRoomAccess)
  async sendMessage(
    @Arg('roomId', () => Int) roomId: number,
    @Arg('text') text: string,
    @Ctx() { res, userLoader }: MyContext,
    @PubSub('NEW_MESSAGE') publish: Publisher<Message>
  ): Promise<SendMessageResponse> {
    const sender = await userLoader.load(res.locals.userId!);
    const message = await Message.create({
      roomId: roomId,
      text,
      senderId: res.locals.userId,
    }).save();
    await publish({ ...message, sender } as any);
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
