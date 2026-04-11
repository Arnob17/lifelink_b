import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { ListingsModule } from '../listings/listings.module';

@Module({
  imports: [ListingsModule],
  controllers: [NewsController],
})
export class NewsModule {}
