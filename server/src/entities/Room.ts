import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import Base from './Base';
import { Message } from './Message';
import { Member } from './Member';

export enum RoomType {
  DM = 'DM',
  GROUP = 'GROUP',
}

registerEnumType(RoomType, {
  name: 'RoomType',
  description:
    'Specifies whether a room is meant direct messaging or group messaging',
});

@ObjectType()
@Entity('rooms')
export class Room extends Base {
  // Relations
  @Column({ nullable: true })
  name?: string;

  @Field(() => RoomType)
  @Column({ type: 'enum', enum: RoomType, default: RoomType.DM })
  type: RoomType;

  @OneToMany(() => Member, (member) => member.room)
  members: Member[];

  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];
}
