import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip_address: string;

  @Column()
  os: string;

  @Column()
  browser: number;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.userLog)
  user: User;
}
