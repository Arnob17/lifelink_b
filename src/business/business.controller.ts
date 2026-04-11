import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayloadUser } from '../common/decorators/current-user.decorator';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { BusinessService } from './business.service';

@Controller('business')
@UseGuards(JwtAuthGuard)
export class BusinessController {
  constructor(private readonly business: BusinessService) {}

  @Get('profile')
  profile(@CurrentUser() user: JwtPayloadUser) {
    return this.business.getProfile(user.sub, user.role);
  }

  @Patch('profile')
  update(
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: UpdateBusinessDto,
  ) {
    return this.business.updateProfile(user.sub, user.role, dto);
  }
}
