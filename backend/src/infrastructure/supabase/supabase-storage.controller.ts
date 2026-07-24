import {
  Controller,
  Post,
  Get,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { SupabaseStorageService } from './supabase-storage.service';
import { Public } from '../../modules/auth/decorators/public.decorator';

@ApiTags('Infrastructure - Supabase Storage (Dev Only)')
@Public()
@Controller('infrastructure/storage')
export class SupabaseStorageController {
  private readonly logger = new Logger(SupabaseStorageController.name);

  constructor(
    private readonly storageService: SupabaseStorageService,
    private readonly configService: ConfigService,
  ) {}

  private checkDevEnvironment() {
    const env = this.configService.get<string>('NODE_ENV', 'development');
    if (env !== 'development') {
      throw new ForbiddenException(
        'Infrastructure test endpoints are only enabled in development mode.',
      );
    }
  }

  @Post('test-upload')
  @ApiOperation({ summary: 'Test file upload to Supabase Storage (Dev Only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
  })
  @UseInterceptors(FileInterceptor('file'))
  async testUpload(@UploadedFile() file?: Express.Multer.File) {
    this.checkDevEnvironment();
    if (!file) {
      throw new BadRequestException('Please provide a file to upload.');
    }

    return await this.storageService.uploadResume(
      file.buffer,
      file.originalname,
      file.mimetype,
    );
  }

  @Get('test-signed-url')
  @ApiOperation({ summary: 'Generate test signed download URL (Dev Only)' })
  @ApiQuery({
    name: 'objectPath',
    required: true,
    example: 'test/infrastructure/example.pdf',
  })
  @ApiQuery({ name: 'expiresIn', required: false, example: 300 })
  async testSignedUrl(
    @Query('objectPath') objectPath: string,
    @Query('expiresIn') expiresIn?: string,
  ) {
    this.checkDevEnvironment();
    if (!objectPath) {
      throw new BadRequestException(
        'Query parameter "objectPath" is required.',
      );
    }

    const ttl = expiresIn ? Number(expiresIn) : undefined;
    return await this.storageService.createSignedDownloadUrl(objectPath, ttl);
  }

  @Delete('test-file')
  @ApiOperation({
    summary: 'Delete test file from Supabase Storage (Dev Only)',
  })
  @ApiQuery({
    name: 'objectPath',
    required: true,
    example: 'test/infrastructure/example.pdf',
  })
  async testDeleteFile(@Query('objectPath') objectPath: string) {
    this.checkDevEnvironment();
    if (!objectPath) {
      throw new BadRequestException(
        'Query parameter "objectPath" is required.',
      );
    }

    return await this.storageService.removeResume(objectPath);
  }
}
