import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Base from './Base';
import { User } from './User';

export enum NotificationType {
  REQUEST_DM = 'REQUEST_DM',
  REQUEST_GROUP = 'REQUEST_GROUP',
  ACCEPT_DM = 'ACCEPT_DM',
  ACCEPT_GROUP = 'ACCEPT_GROUP',
}

registerEnumType(NotificationType, {
  name: 'NotificationType',
  description:
    'Specifies whether a room is meant direct messaging or group messaging',
});

@ObjectType()
@Entity('notifications')
export class Notification extends Base {
  @Field(() => NotificationType)
  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.REQUEST_DM,
  })
  type: NotificationType;

  @Field()
  @Column({ type: 'text' })
  text: string;

  @Field()
  @Column()
  recieverId: number;

  @Field()
  @Column()
  read: boolean;

  @Field()
  @Column()
  redirectId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'recieverId', referencedColumnName: 'id' })
  reciever: string;
}
