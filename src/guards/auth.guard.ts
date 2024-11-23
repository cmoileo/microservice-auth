import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import JwtService from '../services/Jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new HttpException(
        'Authorization token not found',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const jwtService = new JwtService();
    const result: any = await jwtService.verify(token);

    if (!result.valid) {
      throw new HttpException(result.error, HttpStatus.UNAUTHORIZED);
    }

    request.user = result.decoded;
    return true;
  }
}
