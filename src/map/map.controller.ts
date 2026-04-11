import { Controller, Get, Query } from '@nestjs/common';
import { MapService } from './map.service';
import { MapMarkersDto } from './dto/map-markers.dto';

@Controller('map')
export class MapController {
  constructor(private readonly map: MapService) {}

  @Get('markers')
  markers(@Query() query: MapMarkersDto) {
    return this.map.markers(query);
  }
}
