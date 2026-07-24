import type { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export interface AuthenticatedRequest extends Request {
  authUser?: AuthenticatedUser;
}
