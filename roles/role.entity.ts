import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Device } from '../devices/device.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, nullable: true })
  name?: string;

  @ManyToMany(() => Device)
  @JoinTable({
    name: 'roledevices',
    joinColumn: { name: 'roleid', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'deviceid', referencedColumnName: 'id' },
  })
  devices?: Device[];

  @CreateDateColumn()
  createddate!: Date;

  @UpdateDateColumn()
  updateddate!: Date;
}
