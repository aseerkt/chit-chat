import { Field, ObjectType } from 'type-graphql';
import { Message } from '../entities/Message';
import { Errors } from './globalTypes';

@ObjectType()
export class SendMessageResponse extends Errors {
  @Field(() => Message, { nullable: true })
  message?: Message;
}

@ObjectType()
export class PaginatedMessages {
  @Field(() => [Message])
  messages: Message[];

  @Field()
  hasMore: boolean;
}
