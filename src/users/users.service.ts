import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, isCreateUserDto } from './dto/create-user.dto';
import { isUpdateUserDto, UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { checkUUID } from '../services';

const cookUsers = (data: User | User[]) => {
  if (Array.isArray(data)) {
    return data.map((user) => ({
      ...user,
      password: undefined,
      createdAt: +new Date(user.createdAt),
      updatedAt: +new Date(user.updatedAt),
    }));
  }

  return {
    ...data,
    password: undefined,
    createdAt: +new Date(data.createdAt),
    updatedAt: +new Date(data.updatedAt),
  };
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    if (!isCreateUserDto(createUserDto)) {
      throw new HttpException(
        'Body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUser = new User();

    newUser.login = createUserDto.login;
    newUser.password = createUserDto.password;

    await this.users.save(newUser);

    return cookUsers(newUser);
  }

  async findAll() {
    return cookUsers(await this.users.find());
  }

  async findUnique(id: string) {
    if (!checkUUID(id)) {
      throw new HttpException(
        'User id is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.users.findOneBy({ id });
    if (!user) {
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findOne(id: string) {
    const user = await this.findUnique(id);
    return cookUsers(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!isUpdateUserDto(updateUserDto)) {
      throw new HttpException(
        'Body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.findUnique(id);
    if (user.password !== updateUserDto.oldPassword) {
      throw new HttpException('oldPassword is wrong', HttpStatus.FORBIDDEN);
    }
    const updatedUser = {
      ...user,
      password: updateUserDto.newPassword,
    };
    await this.users.save(updatedUser);
    return cookUsers(updatedUser);
  }

  async remove(id: string) {
    const user = await this.findUnique(id);
    await this.users.delete(id);
    return cookUsers(user);
  }
}
