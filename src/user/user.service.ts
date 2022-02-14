import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt } from 'crypto';
import { getConnection } from 'typeorm';
import { promisify } from 'util';
import { UserAuth } from './entities/user-auth.entity';
import { UserDetail } from './entities/user-detail.entity';
import { User } from './entities/user.entity';

const scryptAsync = promisify(scrypt);

@Injectable()
export class UserService {
  async siginupUser({ email, firstName, lastName, phone, password }) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const user = new User();

      user.email = email;
      user.phone = phone;

      const userResult = await queryRunner.manager.save(user);

      const userDetail = new UserDetail();

      userDetail.first_name = firstName;
      userDetail.last_name = lastName;
      userDetail.user = userResult;

      await queryRunner.manager.save(userDetail);

      const hashedPassword = await UserService.toHash(password);
      const userAuth = new UserAuth();

      userAuth.password = hashedPassword;
      userAuth.user = userResult;

      await queryRunner.manager.save(userAuth);

      await queryRunner.commitTransaction();

      return {
        ok: true,
        message: 'User created successfully',
        data: userResult,
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return {
        ok: false,
        message: 'Error creating user',
        error: error.message,
      };
    } finally {
      await queryRunner.release();
    }
  }

  async signinUser({ email, password }) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const getUser = await queryRunner.manager.findOne(User, {
        where: { email },
      });

      if (!getUser) {
        return {
          ok: false,
          message: 'User not found',
        };
      }

      const getUserAuth = await queryRunner.manager.findOne(UserAuth, {
        where: { user: getUser },
      });
      console.log(getUserAuth);

      const comparePassword = await UserService.compare(
        getUserAuth.password,
        password,
      );

      if (!comparePassword) {
        return {
          ok: false,
          message: 'Invalid password',
        };
      }

      await queryRunner.commitTransaction();

      return {
        ok: true,
        message: 'User logged in successfully',
        data: getUser.id,
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return {
        ok: false,
        message: 'Error creating user',
        error: error.message,
      };
    } finally {
      await queryRunner.release();
    }
  }

  async getAllUser() {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const getUser = await queryRunner.manager.find(UserDetail);

      await queryRunner.commitTransaction();

      return getUser;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return {
        ok: false,
        message: 'Error creating user',
        error: error.message,
      };
    } finally {
      await queryRunner.release();
    }
  }

  async updateUser({ id, firstName, lastName }) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const userDetail = new UserDetail();

      if (firstName) {
        userDetail.first_name = firstName;
      }

      if (lastName) {
        userDetail.last_name = lastName;
      }

      await queryRunner.manager.update(UserDetail, id, userDetail);

      await queryRunner.commitTransaction();

      return {
        ok: true,
        message: 'User updated successfully',
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return {
        ok: false,
        message: 'Error creating user',
        error: error.message,
      };
    } finally {
      await queryRunner.release();
    }
  }

  async deleteUser({ id }) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(UserDetail, id);

      await queryRunner.commitTransaction();

      return {
        ok: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return {
        ok: false,
        message: 'Error creating user',
        error: error.message,
      };
    } finally {
      await queryRunner.release();
    }
  }

  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    return buf.toString('hex') === hashedPassword;
  }
}
