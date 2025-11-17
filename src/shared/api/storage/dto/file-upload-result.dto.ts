export class FileUploadResult {
  path: string;
  id: string;
  fullPath: string;

  constructor(partial: Partial<FileUploadResult>) {
    Object.assign(this, partial);
  }
}
