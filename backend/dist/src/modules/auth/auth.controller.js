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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const supabase_auth_service_1 = require("./supabase-auth.service");
const current_user_decorator_1 = require("./decorators/current-user.decorator");
const roles_decorator_1 = require("./decorators/roles.decorator");
const bootstrap_auth_dto_1 = require("./dto/bootstrap-auth.dto");
const invite_admin_dto_1 = require("./dto/invite-admin.dto");
let AuthController = class AuthController {
    authService;
    supabaseAuthService;
    constructor(authService, supabaseAuthService) {
        this.authService = authService;
        this.supabaseAuthService = supabaseAuthService;
    }
    bootstrap(user, dto) {
        return this.authService.bootstrap(user, dto);
    }
    getMe(user) {
        return this.authService.getMe(user.id);
    }
    async inviteAdmin(currentUser, dto) {
        const invitedUser = await this.supabaseAuthService.inviteAdmin(dto.email, dto.fullName);
        try {
            return await this.authService.provisionAdmin(currentUser.id, invitedUser);
        }
        catch (error) {
            await this.supabaseAuthService.deleteAuthUser(invitedUser.id);
            throw error;
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('bootstrap'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create or refresh the application profile for a Supabase user',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Application profile is ready' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, bootstrap_auth_dto_1.BootstrapAuthDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "bootstrap", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Return the current application user and roles' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getMe", null);
__decorate([
    (0, common_1.Post)('admins'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Invite a new administrator' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Administrator invitation created' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, invite_admin_dto_1.InviteAdminDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "inviteAdmin", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        supabase_auth_service_1.SupabaseAuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map