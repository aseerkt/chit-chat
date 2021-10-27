import { ObjectType, Field } from 'type-graphql';
import { Invite } from '../../entities/Invite';

@ObjectType()
export class UserInvites {
  @Field(() => [Invite], { nullable: true })
  recieved: Invite[];

  @Field(() => [Invite], { nullable: true })
  sent: Invite[];
}
