import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Base from './Base';
import { User } from './User';

@Entity('invites')
export class Invite extends Base {
  @Column()
  inviteeId: number;

  @Column()
  inviterId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'inviteeId', referencedColumnName: 'id' })
  invitee: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'inviterId', referencedColumnName: 'id' })
  inviter: User;
}
