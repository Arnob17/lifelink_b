import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const cartItemInclude = {
  product: {
    select: {
      id: true,
      name: true,
      price: true,
      unit: true,
      imageUrl: true,
      stock: true,
      published: true,
      seller: {
        select: {
          id: true,
          name: true,
          businessProfile: { select: { organizationName: true } },
        },
      },
    },
  },
} as const;

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: cartItemInclude,
      orderBy: { createdAt: 'asc' },
    });

    const validItems = items.filter((i) => i.product.published);
    const total = validItems.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0,
    );
    return { items: validItems, total: Math.round(total * 100) / 100 };
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, published: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    if (product.stock < quantity) {
      throw new BadRequestException(
        `Only ${product.stock} items available in stock`,
      );
    }

    const existing = await this.prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (product.stock < newQty) {
        throw new BadRequestException(
          `Only ${product.stock} items available in stock`,
        );
      }
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
        include: cartItemInclude,
      });
    }

    return this.prisma.cartItem.create({
      data: { userId, productId, quantity },
      include: cartItemInclude,
    });
  }

  async updateQuantity(userId: string, itemId: string, quantity: number) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true },
    });
    if (!item || item.userId !== userId) {
      throw new NotFoundException('Cart item not found');
    }

    if (quantity <= 0) {
      await this.prisma.cartItem.delete({ where: { id: itemId } });
      return { deleted: true, id: itemId };
    }

    if (item.product.stock < quantity) {
      throw new BadRequestException(
        `Only ${item.product.stock} items available in stock`,
      );
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: cartItemInclude,
    });
  }

  async removeItem(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findUnique({ where: { id: itemId } });
    if (!item || item.userId !== userId) {
      throw new NotFoundException('Cart item not found');
    }
    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return { deleted: true, id: itemId };
  }

  async clearCart(userId: string) {
    await this.prisma.cartItem.deleteMany({ where: { userId } });
    return { cleared: true };
  }

  async itemCount(userId: string) {
    const count = await this.prisma.cartItem.aggregate({
      where: { userId },
      _sum: { quantity: true },
    });
    return { count: count._sum.quantity ?? 0 };
  }
}
