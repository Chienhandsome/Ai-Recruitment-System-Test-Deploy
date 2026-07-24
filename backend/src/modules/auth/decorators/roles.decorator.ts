import { SetMetadata } from '@nestjs/common';
import { REQUIRED_ROLES_KEY, type AuthRole } from '../auth.constants';

export const Roles = (...roles: AuthRole[]) =>
  SetMetadata(REQUIRED_ROLES_KEY, roles);
