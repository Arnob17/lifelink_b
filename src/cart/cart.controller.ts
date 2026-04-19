import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayloadUser } from '../common/decorators/current-user.decorator';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart-item.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get()
  getCart(@CurrentUser() user: JwtPayloadUser) {
    return this.cart.getCart(user.sub);
  }

  @Get('count')
  count(@CurrentUser() user: JwtPayloadUser) {
    return this.cart.itemCount(user.sub);
  }

  @Post()
  addItem(
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: AddToCartDto,
  ) {
    return this.cart.addItem(user.sub, dto.productId, dto.quantity);
  }

  @Patch(':id')
  updateItem(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cart.updateQuantity(user.sub, id, dto.quantity);
  }

  @Delete(':id')
  removeItem(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
  ) {
    return this.cart.removeItem(user.sub, id);
  }

  @Delete()
  clearCart(@CurrentUser() user: JwtPayloadUser) {
    return this.cart.clearCart(user.sub);
  }
}
