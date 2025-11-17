export class StorageError {
  name: string;
  message: string;
  stack?: string;

  constructor(partial: Partial<StorageError>) {
    Object.assign(this, partial);
  }
}
