import { Body, Controller, Post, Res } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';
import { SignInDto } from './dtos/signin.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const result = await this.userService.siginupUser(createUserDto);

    if (!result.ok) {
      return res.status(400).json({
        message: result.message,
      });
    }

    const userId = result.data.id;
    const userJwt = jwt.sign({ id: userId }, 'secret', { expiresIn: '1h' });

    res.cookie('jwt', userJwt, {
      httpOnly: false,
      maxAge: 1000 * 60 * 60,
    });

    return res.status(201).json({
      message: 'User created successfully',
      data: result.data,
    });
  }

  @Post('signin')
  async signinUser(@Body() signinDto: SignInDto, @Res() res: Response) {
    const result = await this.userService.signinUser(signinDto);

    if (!result.ok) {
      return res.status(400).json({
        message: result.message,
      });
    }

    const userId = result.data;

    const userJwt = jwt.sign({ id: userId }, 'secret', { expiresIn: '1h' });

    res.cookie('jwt', userJwt, {
      httpOnly: false,
      maxAge: 1000 * 60 * 60,
    });

    return res.status(201).json({
      message: 'User signed in successfully',
      data: result.data,
    });
  }
}
