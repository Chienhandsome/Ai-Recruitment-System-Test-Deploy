import { ConfigService } from '@nestjs/config';
import { SupabaseStorageService } from './supabase-storage.service';
export declare class SupabaseStorageController {
    private readonly storageService;
    private readonly configService;
    private readonly logger;
    constructor(storageService: SupabaseStorageService, configService: ConfigService);
    private checkDevEnvironment;
    testUpload(file?: Express.Multer.File): Promise<import("./supabase-storage.service").UploadResult>;
    testSignedUrl(objectPath: string, expiresIn?: string): Promise<import("./supabase-storage.service").SignedUrlResult>;
    testDeleteFile(objectPath: string): Promise<import("./supabase-storage.service").RemoveResult>;
}
