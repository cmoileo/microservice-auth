import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

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

  @Post('verify')
  async verify(@Body() data: { token: string }): Promise<
    | {
        valid: boolean;
        decoded: object;
      }
    | {
        valid: boolean;
        error: string;
      }
  > {
    return await this.authService.verify(data.token);
  }

  @Post('refresh')
  async refresh(@Body() data: { token: string }): Promise<
    | {
        token: string;
      }
    | HttpException
  > {
    return await this.authService.refresh(data.token);
  }
}
