import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './device.entity';
import { PagingService } from '../common/paging/page.service';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly repo: Repository<Device>,
    private readonly paging: PagingService) {}

  create(body: Partial<Device>) {
    const d = this.repo.create(body);
    return this.repo.save(d);
  }

  findAll(query: any) {
    return this.paging.run(this.repo, query, {
      alias: 'd',
      search: ['code', 'name'],
      searchByParam: {
        code: ['code'],
        name: ['name'],
      },
      filters: ['status', 'siactive', 'devicetype'],
      sort: ['id', 'code', 'name'],
      defaultSort: { field: 'id', order: 'ASC' },
    });
  }

  async findOne(id: number) {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) {
      throw new NotFoundException(`Device with id ${id} not found`);
    }
    return u;
  }

  async update(id: number, body: Partial<Device>) {
    const d = await this.repo.findOne({ where: { id } });
    if (!d) {
      throw new NotFoundException(`Device with id ${id} not found`);
    }
    await this.repo.update({ id }, body);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    await this.repo.delete({ id });
    return { message: `Device with id ${id} has been deleted` };
  }
}
