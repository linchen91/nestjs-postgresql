import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import {Role} from './role.entity';
import { Device } from '../devices/device.entity';

interface CreateRoleDto {
  name: string;
  deviceids: number[];
}

type UpdateRoleDto = Partial<CreateRoleDto>;

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly repo: Repository<Role>,
    @InjectRepository(Device)
    private readonly deviceRepo: Repository<Device>,
  ) {}

  async create(body: CreateRoleDto) {
    const { name, deviceids } = body;

    const role = new Role();
    role.name = name;

    if (Array.isArray(deviceids) && deviceids.length > 0) {
      role.devices = await this.deviceRepo.find({
        where: { id: In(deviceids) },
        order: { id: 'ASC' },
      });
    } else {
      role.devices = [];
    }
    return this.repo.save(role);
  }

  findAll() {
    return this.repo.find({
      relations: { devices: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const r = await this.repo.findOne({
      where: { id },
      relations: { devices: true },
    });
    if (!r) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return r;
  }

  async update(id: number, body: UpdateRoleDto) {
    const r = await this.repo.findOne({
      where: { id },
      relations: { devices: true },
    });
    if (!r) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    if (body.name !== undefined) {
      r.name = body.name;
    }

    if (Array.isArray(body.deviceids)) {
      r.devices = await this.deviceRepo.find({
        where: { id: In(body.deviceids) },
        order: { id: 'ASC' },
      });
    }
    return this.repo.save(r);
  }

  async remove(id: number) {
    const r = await this.repo.findOne({
      where: { id },
      relations: { devices: true },
    });
    if (!r) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    await this.repo
      .createQueryBuilder()
      .relation(Role, 'devices')
      .of(id)
      .remove(r.devices);
    await this.repo.delete({ id });
    return { message: `Role with id ${id} has been deleted` };
  }
}
