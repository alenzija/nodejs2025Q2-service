import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateUserDto, isCreateUserDto } from './dto/create-user.dto';
import { isUpdateUserDto, UpdateUserDto } from './dto/update-user.dto';
import { type User } from './entities/user.entity';
import { checkUUID } from '../services';

let users: User[] = [];

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
  create(createUserDto: CreateUserDto) {
    if (!isCreateUserDto(createUserDto)) {
      throw new HttpException('body is not valid', HttpStatus.BAD_REQUEST);
    }
    const newUser = {
      id: uuid(),
      ...createUserDto,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    users = [...users, newUser];
    return deletePasswordFromResult(newUser);
  }

  findAll() {
    return users;
  }

  findUnique(id: string) {
    if (!checkUUID(id)) {
      throw new HttpException('id is not valid', HttpStatus.BAD_REQUEST);
    }
    const user = users.find((user) => id === user.id);
    if (!user) {
      throw new HttpException(
        "User with this id doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  findOne(id: string) {
    const user = this.findUnique(id);
    return deletePasswordFromResult(user);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    if (!isUpdateUserDto(updateUserDto)) {
      throw new HttpException('body is not valid', HttpStatus.BAD_REQUEST);
    }
    const user = this.findUnique(id);
    if (user.password !== updateUserDto.oldPassword) {
      throw new HttpException('Old password is wrong', HttpStatus.FORBIDDEN);
    }
    const updatedUser = {
      ...user,
      password: updateUserDto.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    };
    users = users.map((user) => (user.id === id ? updatedUser : user));
    return deletePasswordFromResult(updatedUser);
  }

  remove(id: string) {
    const user = this.findUnique(id);
    users = users.filter((user) => user.id !== id);
    return deletePasswordFromResult(user);
  }
}
