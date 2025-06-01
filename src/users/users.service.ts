import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateUserDto, isCreateUserDto } from './dto/create-user.dto';
import { isUpdateUserDto, UpdateUserDto } from './dto/update-user.dto';
import { type User } from './entities/user.entity';
import { checkUUID } from '../services';
import { DbService } from '../db/db.service';

const deletePasswordFromResult = (data: User | User[]) => {
  if (Array.isArray(data)) {
    return data.map((user) => ({ ...user, password: undefined }));
  }
  return {
    ...data,
    password: undefined,
  };
};

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => DbService))
    private dbService: DbService,
  ) {}
  create(createUserDto: CreateUserDto) {
    if (!isCreateUserDto(createUserDto)) {
      throw new HttpException(
        'Body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const createdAt = Date.now();
    const newUser = {
      id: uuid(),
      ...createUserDto,
      version: 1,
      createdAt,
      updatedAt: createdAt,
    };
    this.dbService.users = [...this.dbService.users, newUser];
    return deletePasswordFromResult(newUser);
  }

  findAll() {
    return this.dbService.users;
  }

  findUnique(id: string) {
    if (!checkUUID(id)) {
      throw new HttpException(
        'User id is invalid (not uuid)',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = this.dbService.users.find((user) => id === user.id);
    if (!user) {
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  findOne(id: string) {
    const user = this.findUnique(id);
    return deletePasswordFromResult(user);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    if (!isUpdateUserDto(updateUserDto)) {
      throw new HttpException(
        'Body does not contain required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = this.findUnique(id);
    if (user.password !== updateUserDto.oldPassword) {
      throw new HttpException('oldPassword is wrong', HttpStatus.FORBIDDEN);
    }
    const updatedUser = {
      ...user,
      password: updateUserDto.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    };
    this.dbService.users = this.dbService.users.map((user) =>
      user.id === id ? updatedUser : user,
    );
    return deletePasswordFromResult(updatedUser);
  }

  remove(id: string) {
    const user = this.findUnique(id);
    this.dbService.users = this.dbService.users.filter(
      (user) => user.id !== id,
    );
    return deletePasswordFromResult(user);
  }
}
