import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Base from './Base';
import { Room } from './Room';
import { User } from './User';

enum InviteStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

registerEnumType(InviteStatus, {
  name: 'InviteStatus',
  description: 'Status of invite',
});

@ObjectType()
@Entity('invites')
export class Invite extends Base {
  @Field(() => InviteStatus)
  @Column({ type: 'enum', enum: InviteStatus, default: InviteStatus.PENDING })
  status: InviteStatus;

  @Field()
  @Column()
  inviteeId: number;

  @Field()
  @Column()
  inviterId: number;

  @Field()
  @Column()
  roomId: number;

  @ManyToOne(() => Room)
  room: Room;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'inviteeId', referencedColumnName: 'id' })
  invitee: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'inviterId', referencedColumnName: 'id' })
  inviter: User;
}
