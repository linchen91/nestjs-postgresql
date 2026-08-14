import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody } from '@nestjs/swagger';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        account: { type: 'string' },
        pwd: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        isactive: { type: 'string' },
        roleid: { type: 'string' },
      },
      required: ['account', 'pwd'],
    },
  })
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Patch(':id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        account: { type: 'string' },
        pwd: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        isactive: { type: 'string' },
        roleid: { type: 'string' },
      },
      required: ['account', 'pwd'],
    },
  })
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(+id, body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
