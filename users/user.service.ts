import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { UsersRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly repo: UsersRepository) {}

  async create(body: CreateUserDto) {
    const hashedPwd = await bcrypt.hash(body.pwd, 10);
    const data: Partial<User> = {
      ...body,
      pwd: hashedPwd,
    };
    return this.repo.create(data);
  }

  async findAll(): Promise<User[]> {
    return this.repo.findAll();
  }

  async findOne(id: number): Promise <User> {
    const u = await this.repo.findById(id);
    if (!u) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return u;
  }

  async update(id: number, body: UpdateUserDto): Promise<User> {
    const exists = await this.repo.findById(id);
    if (!exists) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const data: Partial<User> = {
      ...exists,
      ...body,
    };

    if (body.pwd) {
      data.pwd = await bcrypt.hash(body.pwd, 10);
    }
    return this.repo.update(id, data);
  }

  async remove(id: number): Promise<{ success: true }> {
    const exists = await this.repo.findById(id);
    if (!exists) throw new NotFoundException('User not found');

    await this.repo.remove(id);
    return { success: true };
  }
}
