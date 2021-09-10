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
