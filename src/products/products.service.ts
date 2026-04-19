import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

const sellerSelect = {
  id: true,
  name: true,
  email: true,
  businessProfile: { select: { organizationName: true, verified: true } },
} as const;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(sellerId: string, role: string, dto: CreateProductDto) {
    if (role !== Role.BUSINESS && role !== Role.ADMIN) {
      throw new ForbiddenException('Only business accounts can list products');
    }
    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        unit: dto.unit ?? 'piece',
        imageUrl: dto.imageUrl,
        category: dto.category ?? 'OTHER',
        stock: dto.stock ?? 0,
        sellerId,
      },
      include: { seller: { select: sellerSelect } },
    });
  }

  async update(id: string, sellerId: string, role: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.sellerId !== sellerId && role !== Role.ADMIN) {
      throw new ForbiddenException('You do not own this product');
    }
    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: { seller: { select: sellerSelect } },
    });
  }

  async remove(id: string, sellerId: string, role: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.sellerId !== sellerId && role !== Role.ADMIN) {
      throw new ForbiddenException('You do not own this product');
    }
    await this.prisma.product.delete({ where: { id } });
    return { deleted: true, id };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, published: true },
      include: { seller: { select: sellerSelect } },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findMine(sellerId: string) {
    return this.prisma.product.findMany({
      where: { sellerId },
      orderBy: { updatedAt: 'desc' },
      include: { seller: { select: sellerSelect } },
    });
  }

  async browse(query: ProductQueryDto) {
    const take = Math.min(query.take ?? 40, 100);
    const skip = query.skip ?? 0;

    const where: Prisma.ProductWhereInput = {
      published: true,
      ...(query.category ? { category: query.category } : {}),
      ...(query.sellerId ? { sellerId: query.sellerId } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search } },
              { description: { contains: query.search } },
            ],
          }
        : {}),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      query.sort === 'price_asc'
        ? { price: 'asc' }
        : query.sort === 'price_desc'
          ? { price: 'desc' }
          : query.sort === 'oldest'
            ? { createdAt: 'asc' }
            : { createdAt: 'desc' };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        take,
        skip,
        orderBy,
        include: { seller: { select: sellerSelect } },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { items, total, take, skip };
  }

  async categories() {
    const rows = await this.prisma.product.groupBy({
      by: ['category'],
      where: { published: true },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });
    return rows.map((r) => ({ category: r.category, count: r._count.id }));
  }
}
