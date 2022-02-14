import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @JoinColumn()
  @OneToOne(() => User, (user) => user.userAuth)
  user: User;
}
