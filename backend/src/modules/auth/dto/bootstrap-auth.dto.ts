import { IsIn, IsOptional } from 'class-validator';
import { PUBLIC_SIGNUP_ROLES, type PublicSignupRole } from '../auth.constants';

export class BootstrapAuthDto {
  @IsOptional()
  @IsIn(PUBLIC_SIGNUP_ROLES)
  role?: PublicSignupRole;
}
