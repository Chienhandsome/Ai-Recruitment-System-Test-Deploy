"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SupabaseStorageController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseStorageController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const supabase_storage_service_1 = require("./supabase-storage.service");
let SupabaseStorageController = SupabaseStorageController_1 = class SupabaseStorageController {
    storageService;
    configService;
    logger = new common_1.Logger(SupabaseStorageController_1.name);
    constructor(storageService, configService) {
        this.storageService = storageService;
        this.configService = configService;
    }
    checkDevEnvironment() {
        const env = this.configService.get('NODE_ENV', 'development');
        if (env !== 'development') {
            throw new common_1.ForbiddenException('Infrastructure test endpoints are only enabled in development mode.');
        }
    }
    async testUpload(file) {
        this.checkDevEnvironment();
        if (!file) {
            throw new common_1.BadRequestException('Please provide a file to upload.');
        }
        return await this.storageService.uploadResume(file.buffer, file.originalname, file.mimetype);
    }
    async testSignedUrl(objectPath, expiresIn) {
        this.checkDevEnvironment();
        if (!objectPath) {
            throw new common_1.BadRequestException('Query parameter "objectPath" is required.');
        }
        const ttl = expiresIn ? Number(expiresIn) : undefined;
        return await this.storageService.createSignedDownloadUrl(objectPath, ttl);
    }
    async testDeleteFile(objectPath) {
        this.checkDevEnvironment();
        if (!objectPath) {
            throw new common_1.BadRequestException('Query parameter "objectPath" is required.');
        }
        return await this.storageService.removeResume(objectPath);
    }
};
exports.SupabaseStorageController = SupabaseStorageController;
__decorate([
    (0, common_1.Post)('test-upload'),
    (0, swagger_1.ApiOperation)({ summary: 'Test file upload to Supabase Storage (Dev Only)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'PDF or DOCX test resume file (max 5MB)',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupabaseStorageController.prototype, "testUpload", null);
__decorate([
    (0, common_1.Get)('test-signed-url'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate test signed download URL (Dev Only)' }),
    (0, swagger_1.ApiQuery)({ name: 'objectPath', required: true, example: 'test/infrastructure/example.pdf' }),
    (0, swagger_1.ApiQuery)({ name: 'expiresIn', required: false, example: 300 }),
    __param(0, (0, common_1.Query)('objectPath')),
    __param(1, (0, common_1.Query)('expiresIn')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SupabaseStorageController.prototype, "testSignedUrl", null);
__decorate([
    (0, common_1.Delete)('test-file'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete test file from Supabase Storage (Dev Only)' }),
    (0, swagger_1.ApiQuery)({ name: 'objectPath', required: true, example: 'test/infrastructure/example.pdf' }),
    __param(0, (0, common_1.Query)('objectPath')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupabaseStorageController.prototype, "testDeleteFile", null);
exports.SupabaseStorageController = SupabaseStorageController = SupabaseStorageController_1 = __decorate([
    (0, swagger_1.ApiTags)('Infrastructure - Supabase Storage (Dev Only)'),
    (0, common_1.Controller)('infrastructure/storage'),
    __metadata("design:paramtypes", [supabase_storage_service_1.SupabaseStorageService,
        config_1.ConfigService])
], SupabaseStorageController);
//# sourceMappingURL=supabase-storage.controller.js.map