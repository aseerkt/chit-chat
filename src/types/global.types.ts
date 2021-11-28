import { Request, Response } from 'express';
import { Field, ObjectType } from 'type-graphql';
import memberLoader from '../dataloaders/memberLoader';
import messageLoader from '../dataloaders/messageLoader';
import userLoader from '../dataloaders/userLoader';

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
  userLoader: typeof userLoader;
  memberLoader: typeof memberLoader;
  msgLoader: typeof messageLoader;
}
