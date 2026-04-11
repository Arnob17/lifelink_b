import { Controller, Get, Query } from '@nestjs/common';
import { ListingType } from '@prisma/client';
import { ListingsService } from '../listings/listings.service';
import { ListingQueryDto } from '../listings/dto/listing-query.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly listings: ListingsService) {}

  @Get()
  list(@Query() query: ListingQueryDto) {
    return this.listings.searchPublic({ ...query, type: ListingType.JOB });
  }
}
