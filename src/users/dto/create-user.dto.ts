import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email khong dung dinh dang' })
  @IsNotEmpty({ message: 'Email khong duoc bo trong' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Mat khau khong duoc de trong' })
  @MinLength(6, { message: 'Mat khau phai co it nhat 6 ky tu' })
  password: string;

  @IsString()
  @IsOptional() // cho phep nul hoac bo trong
  fullName?: string;
}
