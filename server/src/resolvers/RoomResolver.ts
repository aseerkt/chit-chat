import {
  Field,
  Resolver,
  ObjectType,
  FieldResolver,
  Root,
  Ctx,
} from 'type-graphql';
import { Room } from '../entities/Room';
import { User } from '../entities/User';
import { Errors, MyContext } from '../types/globalTypes';

@ObjectType()
export class CreateRoomResponse extends Errors {
  @Field(() => Room, { nullable: true })
  room?: Room;
}

@Resolver(Room)
export class RoomResolver {
  @FieldResolver(() => [User])
  members(@Root() room: Room, @Ctx() { memberLoader }: MyContext) {
    return memberLoader.load(room.id);
  }
}
