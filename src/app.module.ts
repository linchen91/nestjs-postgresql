import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloController } from './hello.controller';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestModule } from '../test/test.module';
import { TestEntity } from '../test/test.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/user.module';
import { User } from '../users/user.entity';
import { DevicesModule } from '../devices/device.module';
import { Device } from '../devices/device.entity';
import { RolesModule } from '../roles/role.module';
import { Role } from '../roles/role.entity';
import { PagingModule } from '../common/paging/page.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (cs: ConfigService) => ({
        type: 'postgres',
        host: cs.get<string>('DB_HOST') || 'localhost',
        port: cs.get<number>('DB_PORT') || 5432,
        username: cs.get<string>('DB_USERNAME') || 'postgres',
        password: cs.get<string>('DB_PASSWORD') || 'password',
        database: cs.get<string>('DB_NAME') || 'drivez_db',
        entities: [TestEntity, User, Device, Role],
        synchronize: false,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    PagingModule,
    AuthModule,
    UsersModule,
    TestModule,
    DevicesModule,
    RolesModule,
  ],
  controllers: [AppController, HelloController],
  providers: [AppService],
})
export class AppModule {}
