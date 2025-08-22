import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUsersDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  imei: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  company: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  password: string;
}
