import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SUPABASE_CLIENT } from './storage.module';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseStorageResponse } from './dto/supabase-storage-response.dto';
import { PublicUrlResponse } from './dto/public-url-response.dto';
import { UploadFile } from './entities/upload-file.entity';

const BUCKET_NAME = 'avatars';

@Injectable()
export class StorageService {
  constructor(@Inject(SUPABASE_CLIENT) private supbase: SupabaseClient) {}

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string,
  ): Promise<UploadFile> {
    // tai file
    const supabaseStorageResponse: SupabaseStorageResponse =
      await this.supbase.storage
        .from(BUCKET_NAME)
        .upload(fileName, fileBuffer, {
          contentType: contentType,
          upsert: true, // cho phep ghi de len file da ton tai
        });

    if (supabaseStorageResponse.error) {
      throw new InternalServerErrorException(
        `Loi khi tai file: ${supabaseStorageResponse.error.message}`,
      );
    }

    const publicUrlResponse: PublicUrlResponse = this.supbase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(supabaseStorageResponse.data?.path || '');

    if (!publicUrlResponse.data.publicUrl) {
      throw new InternalServerErrorException('Khong the lay public URL');
    }

    return new UploadFile({
      url: publicUrlResponse.data.publicUrl,
      path: supabaseStorageResponse.data?.path,
    });
  }
}
