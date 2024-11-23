import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  password: string;
}
