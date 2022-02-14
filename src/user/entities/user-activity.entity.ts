import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  is_blocked: boolean;

  @Column()
  is_active: boolean;

  @JoinColumn()
  @OneToOne(() => User, (user) => user.userActivity)
  user: User;
}
