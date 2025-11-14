import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
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

  @Column({
    type: 'text',
    nullable: true,
  })
  @ApiProperty()
  avatarUrl: string;

  @CreateDateColumn()
  @ApiProperty()
  createAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updateAt: Date;
}
