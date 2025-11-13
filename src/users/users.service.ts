import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationQueryDto } from 'src/shared/dtos/pagination-query.dto';
import { PaginatedResponse } from 'src/shared/dtos/paginated-response.dto';

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
}
