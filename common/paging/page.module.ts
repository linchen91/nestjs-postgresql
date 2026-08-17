import { Global, Module } from '@nestjs/common';
import { PagingService } from './page.service';

@Global()
@Module({
  providers: [PagingService],
  exports: [PagingService],
})
export class PagingModule { }
