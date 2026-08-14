import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  account: string;

  @Column({ length: 50, nullable: true })
  name?: string;

  @Column({ length: 50, nullable: true })
  email?: string;

  @Column({ length: 200 })
  pwd: string;

  @Column({ type: 'bit', nullable: true })
  isactive: string;

  @Column({ type: 'bigint', nullable: true })
  roleid?: string;

  @CreateDateColumn()
  createddate!: Date;

  @UpdateDateColumn()
  updateddate!: Date;
}
