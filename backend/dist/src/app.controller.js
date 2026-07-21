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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const app_service_1 = require("./app.service");
const prisma_service_1 = require("./database/prisma.service");
const supabase_storage_service_1 = require("./infrastructure/supabase/supabase-storage.service");
const rabbitmq_service_1 = require("./infrastructure/rabbitmq/rabbitmq.service");
let AppController = class AppController {
    appService;
    prismaService;
    supabaseStorageService;
    rabbitMqService;
    configService;
    constructor(appService, prismaService, supabaseStorageService, rabbitMqService, configService) {
        this.appService = appService;
        this.prismaService = prismaService;
        this.supabaseStorageService = supabaseStorageService;
        this.rabbitMqService = rabbitMqService;
        this.configService = configService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async getHealth() {
        const backendStatus = 'UP';
        const dbHealth = await this.prismaService.checkHealth();
        const storageHealth = await this.supabaseStorageService.checkHealth();
        const rabbitHealth = await this.rabbitMqService.checkHealth();
        let aiServiceStatus = 'DOWN';
        const aiServiceUrl = this.configService.get('AI_SERVICE_URL', 'http://localhost:8000');
        try {
            const response = await fetch(`${aiServiceUrl}/health`, {
                signal: AbortSignal.timeout(3000),
            });
            if (response.ok) {
                aiServiceStatus = 'UP';
            }
        }
        catch {
            aiServiceStatus = 'DOWN';
        }
        const services = {
            backend: backendStatus,
            supabaseDatabase: dbHealth.status,
            supabaseStorage: storageHealth.status,
            rabbitmq: rabbitHealth.status,
            aiService: aiServiceStatus,
        };
        const isAllUp = Object.values(services).every((s) => s === 'UP');
        const overallStatus = isAllUp ? 'UP' : 'DEGRADED';
        return {
            status: overallStatus,
            services,
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Welcome message' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'System-wide health check endpoint' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Aggregated infrastructure and service status details',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'UP' },
                services: {
                    type: 'object',
                    properties: {
                        backend: { type: 'string', example: 'UP' },
                        supabaseDatabase: { type: 'string', example: 'UP' },
                        supabaseStorage: { type: 'string', example: 'UP' },
                        rabbitmq: { type: 'string', example: 'UP' },
                        aiService: { type: 'string', example: 'UP' },
                    },
                },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getHealth", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('System'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        prisma_service_1.PrismaService,
        supabase_storage_service_1.SupabaseStorageService,
        rabbitmq_service_1.RabbitMQService,
        config_1.ConfigService])
], AppController);
//# sourceMappingURL=app.controller.js.map