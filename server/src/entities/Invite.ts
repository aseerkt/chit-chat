import { ManyToOne } from 'typeorm';
import Base from './Base';
import { User } from './User';

export class Invite extends Base {
  @ManyToOne(() => User)
  invitee: User;

  @ManyToOne(() => User)
  inviter: User;
}
