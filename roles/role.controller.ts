import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { RolesService } from './role.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('roles')
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        deviceids: {
          type: 'array',
          items: { type: 'integer' },
        },
      },
      required: ['name'],
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
        name: { type: 'string' },
        deviceids: {
          type: 'array',
          items: { type: 'integer' },
        },
      },
      required: ['name'],
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
