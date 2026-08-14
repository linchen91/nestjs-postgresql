import { Controller, Get, Query } from '@nestjs/common';
import { Public } from '../auth/auth.public';

@Controller('api')
export class HelloController {
  @Get('hello')
  getHello(@Query('name') name: string): string {
    return `Hello, ${name || 'World'}!`;
  }
}
