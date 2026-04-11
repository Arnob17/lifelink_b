import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { ListingsModule } from '../listings/listings.module';

@Module({
  imports: [ListingsModule],
  controllers: [JobsController],
})
export class JobsModule {}
