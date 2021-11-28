import { Field, Int, ObjectType } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
} from 'typeorm';
import bcrypt from 'bcryptjs';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  fullName: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field()
  @Column({ default: false })
  private: boolean;

  @Column({ type: 'text' })
  password: string;

  // Methods

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  verifyPassword(password: string) {
    return bcrypt.compare(password, this.password);
  }
}
