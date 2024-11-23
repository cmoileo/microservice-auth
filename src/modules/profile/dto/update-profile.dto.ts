import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'The firstname of the user',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({
    description: 'The lastname of the user',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({
    description: 'The age of the user',
    example: 25,
  })
  @IsNumber()
  @IsOptional()
  age: number;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '1234567890',
  })
  @IsString()
  @IsOptional()
  phoneNumber: string;
}
