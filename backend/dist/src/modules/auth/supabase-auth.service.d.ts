import { ConfigService } from '@nestjs/config';
import type { AuthenticatedUser } from './auth.types';
export declare class SupabaseAuthService {
    private readonly configService;
    private readonly logger;
    private readonly client;
    private adminClient;
    constructor(configService: ConfigService);
    verifyAccessToken(accessToken: string): Promise<AuthenticatedUser>;
    inviteAdmin(email: string, fullName: string): Promise<AuthenticatedUser>;
    deleteAuthUser(userId: string): Promise<void>;
    private getStringClaim;
    private getObjectClaim;
    private getMetadataString;
}
