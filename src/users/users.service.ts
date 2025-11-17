import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationQueryDto } from 'src/shared/dtos/pagination-query.dto';
import { PaginatedResponse } from 'src/shared/dtos/paginated-response.dto';
import * as bcrypt from 'bcrypt';
import { UploadFile } from 'src/shared/api/storage/entities/upload-file.entity';

@Injectable()
export class UsersService {
  // insert repo
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // create() tao 1 doi tuong entity, chua luu vao DB
    const newUser = this.usersRepository.create(createUserDto);
    newUser.password = await this.hashPassword(newUser);

    // save() moi thuc su luu vao csdl
    return this.usersRepository.save(newUser);
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    // dung queryBuilder de lay password
    // vi da set `select: false` trong entity
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<User>> {
    const { page, limit } = paginationQueryDto;

    const skip = (page - 1) * limit;

    const [users, totalItems] = await this.usersRepository.findAndCount({
      take: limit,
      skip: skip, // offset
      order: {
        createAt: 'DESC',
      },
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: users,
      meta: {
        totalItems,
        currentPage: page,
        totalPages,
        itemsPerPage: limit,
      },
    };
  }

  async hashPassword(user: User): Promise<string> {
    if (user.password) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash(user.password, salt);

      return password;
    }

    throw new NotFoundException('Khong tim thay password cua user');
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async updateAvatar(userId: string, avatarFile: UploadFile): Promise<User> {
    await this.usersRepository.update(userId, { avatar: avatarFile });

    const updatedUser = await this.findById(userId);
    return updatedUser;
  }
}
