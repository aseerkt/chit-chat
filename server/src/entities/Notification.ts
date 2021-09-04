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
  description: 'Type of Notification',
});

@ObjectType()
@Entity('notifications')
export class Notification extends Base {
  @Field(() => NotificationType)
  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Field()
  @Column({ type: 'text' })
  text: string;

  @Field()
  @Column()
  recieverId: number;

  @Field()
  @Column({ default: false })
  read: boolean;

  @Field()
  @Column()
  redirectId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'recieverId', referencedColumnName: 'id' })
  reciever: string;
}
