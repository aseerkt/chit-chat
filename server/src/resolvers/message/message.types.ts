import { Field, ObjectType } from 'type-graphql';
import { Message } from '../../entities/Message';
import { Errors } from '../../types/global.types';

@ObjectType()
export class SendMessageResponse extends Errors {
  @Field(() => Message, { nullable: true })
  message?: Message;
}

@ObjectType()
export class PaginatedMessages {
  @Field(() => [Message])
  nodes: Message[];

  @Field()
  hasMore: boolean;
}

@ObjectType()
export class NewMessagePayload {
  @Field(() => Message)
  message: Message;

  @Field(() => [Number])
  participants: number[];
}
