import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  create(data: Partial<User>): Promise<User> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  findAll(): Promise<User[]> {
    return this.repo.find({
        order: { id: 'ASC'},
    });
  }

  findById(id: number): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    await this.repo.update(id, data);
    const updated = await this.repo.findOne({ where: { id } });

    if (!updated) {
      throw new Error('User not found after update');
    }

    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
