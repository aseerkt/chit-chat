import { Request, Response } from 'express';
import { Field, ObjectType } from 'type-graphql';
import createMembersLoader from '../dataloaders/memberLoader';
import createMessageLoader from '../dataloaders/messageLoader';
import createUserLoader from '../dataloaders/userLoader';

@ObjectType()
export class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
export class Errors {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@ObjectType()
export class DefaultResponse extends Errors {
  @Field()
  ok: boolean;
}

export interface MyContext {
  req: Request;
  res: Response & { locals: { userId?: number } };
  userLoader: ReturnType<typeof createUserLoader>;
  memberLoader: ReturnType<typeof createMembersLoader>;
  msgLoader: ReturnType<typeof createMessageLoader>;
}
