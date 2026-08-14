import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './role.controller';
import { RolesService } from './role.service';
import { Role } from './role.entity';
import { Device } from '../devices/device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Device])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
