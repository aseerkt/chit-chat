import { Field, InputType, ObjectType } from 'type-graphql';
import { User } from '../../entities/User';
import { Errors } from '../../types/global.types';

@ObjectType()
export class UserResponse extends Errors {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field({ nullable: true })
  token?: string;
}

@InputType()
export class LoginInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@InputType()
export class RegisterInput extends LoginInput {
  @Field()
  fullName: string;
}

@ObjectType()
export class PaginatedUsers {
  @Field(() => [User])
  nodes: User[];
  @Field()
  hasMore: boolean;
}
