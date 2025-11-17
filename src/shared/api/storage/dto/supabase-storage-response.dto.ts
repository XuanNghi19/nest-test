import { FileUploadResult } from './file-upload-result.dto';
import { StorageError } from './storage-error.dto';

export class SupabaseStorageResponse {
  data: FileUploadResult | null;
  error: StorageError | null;
}
