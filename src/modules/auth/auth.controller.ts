import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { LoginUserDto } from './dto/LoginUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() data: LoginUserDto): Promise<
    | {
        token: string;
      }
    | HttpException
  > {
    return await this.authService.login(data);
  }

  @Post('register')
  async register(@Body() data: CreateUserDto): Promise<
    | {
        email: string;
        token: string;
      }
    | HttpException
  > {
    return await this.authService.register(data);
  }
}
