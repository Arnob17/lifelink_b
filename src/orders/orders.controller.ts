import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayloadUser } from '../common/decorators/current-user.decorator';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderQueryDto } from './dto/order-query.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  placeOrder(
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: CreateOrderDto,
  ) {
    return this.orders.placeOrder(user.sub, dto);
  }

  @Get()
  myOrders(
    @CurrentUser() user: JwtPayloadUser,
    @Query() query: OrderQueryDto,
  ) {
    return this.orders.myOrders(user.sub, query);
  }

  @Get('seller')
  @UseGuards(RolesGuard)
  @Roles(Role.BUSINESS, Role.ADMIN)
  sellerOrders(
    @CurrentUser() user: JwtPayloadUser,
    @Query() query: OrderQueryDto,
  ) {
    return this.orders.sellerOrders(user.sub, query);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
  ) {
    return this.orders.findOne(id, user.sub, user.role);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orders.updateStatus(id, user.sub, user.role, dto.status);
  }
}
