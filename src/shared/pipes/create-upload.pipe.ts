import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export const CreateUploadPipe = (maxSize: number, types: string) =>
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize }),
      new FileTypeValidator({ fileType: types }),
    ],
  });
