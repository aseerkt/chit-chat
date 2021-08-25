import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Base from './Base';
import { Room } from './Room';
import { User } from './User';

@ObjectType()
@Entity('messages')
export class Message extends Base {
  @Field()
  @Column({ type: 'text' })
  text: string;

  @Field()
  @Column()
  senderId: number;

  @Field()
  @Column()
  roomId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'senderId', referencedColumnName: 'id' })
  sender: User;

  @ManyToOne(() => Room, (room) => room.messages, { onDelete: 'CASCADE' })
  room: Room;
}
