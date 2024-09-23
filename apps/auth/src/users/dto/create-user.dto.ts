import { RolesEnum } from '@app/common/enum/roles.enum';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(RolesEnum)
  @IsNotEmpty()
  role: RolesEnum;
}
