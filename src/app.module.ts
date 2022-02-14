import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserActivity } from './user/entities/user-activity.entity';
import { UserAuth } from './user/entities/user-auth.entity';
import { UserDetail } from './user/entities/user-detail.entity';
import { UserLog } from './user/entities/user-log.entity';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'testinguser',
      password: 'testpassword',
      database: 'testdatabase',
      logging: true,
      entities: [User, UserDetail, UserActivity, UserLog, UserAuth],
      synchronize: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
