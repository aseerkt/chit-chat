import { Field, ObjectType, registerEnumType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Room } from './Room';
import { User } from './User';

export enum MemberRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  INVITED = 'INVITED',
}

registerEnumType(MemberRole, {
  name: 'MemberRole',
  description: 'Specifies member role',
});

@ObjectType()
@Entity('members')
export class Member extends BaseEntity {
  @Field(() => MemberRole)
  @Column({ type: 'enum', enum: MemberRole, default: MemberRole.MEMBER })
  role: MemberRole;

  @Field()
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  roomId: number;

  @ManyToOne(() => Room, (room) => room.members, { onDelete: 'CASCADE' })
  room: Room;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;
}
