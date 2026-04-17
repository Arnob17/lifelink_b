import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayloadUser } from '../common/decorators/current-user.decorator';
import { CreateSosDto } from './dto/create-sos.dto';
import { SosNearbyDto } from './dto/sos-nearby.dto';
import { SosService } from './sos.service';

@Controller('sos')
export class SosController {
  constructor(private readonly sos: SosService) {}

  @Get('nearby')
  nearby(@Query() query: SosNearbyDto) {
    return this.sos.nearby(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: JwtPayloadUser, @Body() dto: CreateSosDto) {
    return this.sos.create(user.sub, dto);
  }
}
