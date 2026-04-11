import { Module } from '@nestjs/common';
import { BloodController } from './blood.controller';
import { BloodService } from './blood.service';
import { ListingsModule } from '../listings/listings.module';

@Module({
  imports: [ListingsModule],
  controllers: [BloodController],
  providers: [BloodService],
})
export class BloodModule {}
