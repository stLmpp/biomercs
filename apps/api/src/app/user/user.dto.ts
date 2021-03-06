import { IsBoolean, IsDefined, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsArrayNumber, IsDate, IsNumber } from '@biomercs/api-validation';

export class UserAddDto {
  constructor(partial?: Partial<UserAddDto>) {
    Object.assign(this, partial);
  }

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  salt!: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsDate()
  lastOnline?: Date;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

export class UserUpdateDto {
  @IsOptional()
  @IsDate()
  lastOnline?: Date;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

export class UserGetDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsArrayNumber()
  ids?: number[];

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
