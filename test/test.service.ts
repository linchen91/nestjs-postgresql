import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {TestEntity} from './test.entity';  

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(TestEntity)
    private readonly repo: Repository<TestEntity>,
  ) {}

  findAllOrm() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  findAllSql() {
    return this.repo.query('SELECT * FROM test ORDER BY id ASC');
  }
}
