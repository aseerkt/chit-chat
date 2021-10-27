import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Base from './Base';
import { Room } from './Room';
import { User } from './User';

@ObjectType()
@Entity('invites')
export class Invite extends Base {
  @Field()
  @Column({ type: 'text' })
  info: string;

  @Field()
  @Column()
  inviteeId: number;

  @Field()
  @Column()
  inviterId: number;

  @Field()
  @Column()
  roomId: number;

  @ManyToOne(() => Room, { onDelete: 'CASCADE' })
  room: Room;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'inviteeId', referencedColumnName: 'id' })
  invitee: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'inviterId', referencedColumnName: 'id' })
  inviter: User;
}
