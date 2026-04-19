import {
  Body,
  Controller,
  Delete,
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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  browse(@Query() query: ProductQueryDto) {
    return this.products.browse(query);
  }

  @Get('categories')
  categories() {
    return this.products.categories();
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  mine(@CurrentUser() user: JwtPayloadUser) {
    return this.products.findMine(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.products.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUSINESS, Role.ADMIN)
  create(
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: CreateProductDto,
  ) {
    return this.products.create(user.sub, user.role, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUSINESS, Role.ADMIN)
  update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayloadUser,
    @Body() dto: UpdateProductDto,
  ) {
    return this.products.update(id, user.sub, user.role, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUSINESS, Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayloadUser) {
    return this.products.remove(id, user.sub, user.role);
  }
}
