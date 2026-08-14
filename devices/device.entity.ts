import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  code?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  devicetype?: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  params?: string;

  @Column({ type: 'numeric', precision: 9, scale: 6, nullable: true })
  lat?: number;

  @Column({ type: 'numeric', precision: 9, scale: 6, nullable: true })
  lng?: number;

  @Column({ type: 'bit', nullable: true })
  isactive?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  status?: string;

  @CreateDateColumn()
  createddate!: Date;

  @UpdateDateColumn()
  updateddate!: Date;
}
