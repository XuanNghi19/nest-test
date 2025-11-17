import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UploadFile } from 'src/shared/api/storage/entities/upload-file.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  @ApiProperty()
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
    select: false, // khong bao h tra vef truong nay khi truy van
  })
  @ApiProperty()
  @Exclude() // an truong nay khi dung class-transformer (vd: response)
  password: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  @ApiProperty()
  fullName: string;

  @OneToOne(() => File, { nullable: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  @ApiProperty()
  avatar: UploadFile;

  @CreateDateColumn()
  @ApiProperty()
  createAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updateAt: Date;
}
