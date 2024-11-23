import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import HashService from '../../services/Hash.service';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import JwtService from '../../services/Jwt.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async login(data: LoginUserDto): Promise<
    | {
        token: string;
      }
    | HttpException
  > {
    const { email, password } = data;
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      return new HttpException('User not found', 404);
    }

    const isPasswordValid = await HashService.comparePasswords(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      return new HttpException('Invalid password', 401);
    }

    const token: string = await new JwtService().generateToken(
      {
        email: user.email,
      },
      '1d',
    );

    user.refreshToken = token;
    await this.userRepository.save(user);

    return {
      token: token,
    };
  }

  public async register(data: CreateUserDto): Promise<
    | {
        email: string;
        token: string;
      }
    | HttpException
  > {
    const { email, password } = data;
    const isUserExist = await this.userRepository.findOne({
      where: { email: email },
    });
    if (isUserExist) {
      return new HttpException('User already exists', 409);
    }
    const hashedPassword: string = await HashService.hashPassword(password);
    const newUser = new User();
    newUser.email = email;
    newUser.password = hashedPassword;

    try {
      const token: string = await new JwtService().generateToken(
        {
          email: email,
        },
        '1d',
      );
      newUser.refreshToken = token;
      const createdUser = await this.userRepository.save(newUser);
      return {
        email: createdUser.email,
        token: token,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  public async verify(token: string): Promise<
    | {
        valid: boolean;
        decoded: object;
      }
    | {
        valid: boolean;
        error: string;
      }
  > {
    return await new JwtService().verify(token);
  }

  public async refresh(token: string): Promise<
    | {
        token: string;
      }
    | HttpException
  > {
    const result: any = await new JwtService().verify(token);
    if (result.valid) {
      const newToken = await new JwtService().generateToken(
        {
          email: result.decoded['email'],
        },
        '1d',
      );
      const user = await this.userRepository.findOne({
        where: { email: result.decoded['email'] },
      });
      user.refreshToken = newToken;
      await this.userRepository.save(user);
      return {
        token: newToken,
      };
    } else {
      return new HttpException(result.error, 401);
    }
  }
}
