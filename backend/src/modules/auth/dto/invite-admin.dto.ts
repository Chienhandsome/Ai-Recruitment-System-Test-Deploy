import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class InviteAdminDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName!: string;
}
