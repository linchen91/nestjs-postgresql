import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { ApiBody } from '@nestjs/swagger';
import { Page } from '../common/paging/page.decorator';
import { ApiPagingQueries } from '../common/paging/api-page-queries';

@Controller('devices')
export class DeviceController {
  constructor(private readonly service: DeviceService) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string' },
        name: { type: 'string' },
        devicetype: { type: 'string' },
        params: { type: 'string' },
        lat: { type: 'string', description: 'Latitude in decimal degrees' },
        lng: { type: 'string', description: 'Longitude in decimal degrees' },
        isactive: { type: 'string' },
        status: { type: 'string', description: 'Device status' },
      },
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
        code: { type: 'string' },
        name: { type: 'string' },
        devicetype: { type: 'string' },
        params: { type: 'string' },
        lat: { type: 'string', description: 'Latitude in decimal degrees' },
        lng: { type: 'string', description: 'Longitude in decimal degrees' },
        isactive: { type: 'string' },
        status: { type: 'string', description: 'Device status' },
      },
    },
  })
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(+id, body);
  }

  @ApiPagingQueries({
    search: [
      { name: 'q', type: String, description: 'q'},
      { name: 'name', type: String, description: 'name'},
      { name: 'code', type: String, description: 'code'},
    ],
    filters: [
      { name: 'status', type: String, description: 'status'},
      { name: 'isactive', type: String, description: 'isactive'},
      { name: 'devicetype', type: String, description: 'devicetype'},
    ],   
  })
  @Get()
  findAll(@Page() query: any) {
    return this.service.findAll(query);
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
