import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  create(body: Partial<User>) {
    const u = this.repo.create(body);
    return this.repo.save(u);
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return u;
  }

  async update(id: number, body: Partial<User>) {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.repo.update({ id }, body);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    await this.repo.delete({ id });
    return { message: `User with id ${id} has been deleted` };
  }
}
