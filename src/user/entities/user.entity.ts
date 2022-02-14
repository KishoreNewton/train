import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { UserActivity } from './user-activity.entity';
import { UserAuth } from './user-auth.entity';
import { UserDetail } from './user-detail.entity';
import { UserLog } from './user-log.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'bigint' })
  phone: number;

  @OneToOne(() => UserDetail, (userDetail) => userDetail.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  userDetail: UserDetail;

  @OneToOne(() => UserActivity, (userActivity) => userActivity.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  userActivity: UserActivity;

  @OneToMany(() => UserLog, (userLog) => userLog.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  userLog: UserLog;

  @OneToOne(() => UserAuth, (userAuth) => userAuth.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  userAuth: UserAuth;
}
