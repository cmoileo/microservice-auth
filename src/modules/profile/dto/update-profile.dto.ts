import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsNumber()
  @IsOptional()
  age: number;

  @IsString()
  @IsOptional()
  phoneNumber: string;
}
