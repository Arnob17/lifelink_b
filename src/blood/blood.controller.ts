import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayloadUser } from '../common/decorators/current-user.decorator';
import { BloodService } from './blood.service';
import { RegisterDonorDto } from './dto/register-donor.dto';
import { BloodSearchDto } from './dto/blood-search.dto';
import { AiSuggestDto } from './dto/ai-suggest.dto';

@Controller('blood')
export class BloodController {
  constructor(private readonly blood: BloodService) {}

  @Get('search')
  search(@Query() query: BloodSearchDto) {
    return this.blood.search(query);
  }

  @Get('ai-suggest')
  aiSuggest(@Query() query: AiSuggestDto) {
    return this.blood.aiSuggest(query);
  }

  @Post('donor')
  @UseGuards(JwtAuthGuard)
  registerDonor(
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: RegisterDonorDto,
  ) {
    return this.blood.registerDonor(user.sub, user.role, dto);
  }
}
