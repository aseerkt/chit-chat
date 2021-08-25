import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Room } from './Room';
import { User } from './User';

@ObjectType()
@Entity('members')
export class Member extends BaseEntity {
  @Field()
  @PrimaryColumn()
  userId: number;

  @Field()
  @PrimaryColumn()
  roomId: number;

  @ManyToOne(() => Room, { onDelete: 'CASCADE' })
  room: Room;

  @Field()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;
}
