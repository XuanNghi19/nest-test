import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('upload-file')
export class UploadFile {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  // public url de hien thi anh
  @Column({
    type: 'text',
    nullable: false,
  })
  @ApiProperty()
  url: string;

  // path de delete/update
  @Column({
    type: 'text',
    nullable: false,
  })
  @ApiProperty()
  path: string;

  constructor(partial: Partial<UploadFile>) {
    Object.assign(this, partial);
  }
}
