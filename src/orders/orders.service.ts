import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';

const orderInclude = {
  items: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
          unit: true,
          seller: {
            select: {
              id: true,
              name: true,
              businessProfile: { select: { organizationName: true } },
            },
          },
        },
      },
    },
  },
  buyer: { select: { id: true, name: true, email: true, phone: true } },
} as const;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async placeOrder(buyerId: string, dto: CreateOrderDto) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId: buyerId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const validItems = cartItems.filter((ci) => ci.product.published);
    if (validItems.length === 0) {
      throw new BadRequestException('No valid products in cart');
    }

    for (const ci of validItems) {
      if (ci.product.stock < ci.quantity) {
        throw new BadRequestException(
          `"${ci.product.name}" only has ${ci.product.stock} items in stock`,
        );
      }
    }

    const totalAmount = validItems.reduce(
      (sum, ci) => sum + ci.product.price * ci.quantity,
      0,
    );

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          buyerId,
          totalAmount: Math.round(totalAmount * 100) / 100,
          shippingAddress: dto.shippingAddress,
          contactPhone: dto.contactPhone,
          note: dto.note,
          items: {
            create: validItems.map((ci) => ({
              productId: ci.productId,
              quantity: ci.quantity,
              unitPrice: ci.product.price,
            })),
          },
        },
        include: orderInclude,
      });

      for (const ci of validItems) {
        await tx.product.update({
          where: { id: ci.productId },
          data: { stock: { decrement: ci.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { userId: buyerId } });

      return created;
    });

    return order;
  }

  async myOrders(buyerId: string, query: OrderQueryDto) {
    const take = Math.min(query.take ?? 20, 50);
    const skip = query.skip ?? 0;

    return this.prisma.order.findMany({
      where: {
        buyerId,
        ...(query.status ? { status: query.status } : {}),
      },
      take,
      skip,
      orderBy: { createdAt: 'desc' },
      include: orderInclude,
    });
  }

  async findOne(orderId: string, userId: string, role: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: orderInclude,
    });
    if (!order) throw new NotFoundException('Order not found');

    const isOwner = order.buyerId === userId;
    const isSeller = order.items.some(
      (item) => item.product.seller.id === userId,
    );
    if (!isOwner && !isSeller && role !== Role.ADMIN) {
      throw new ForbiddenException('Access denied');
    }
    return order;
  }

  /** Orders containing products sold by this business */
  async sellerOrders(sellerId: string, query: OrderQueryDto) {
    const take = Math.min(query.take ?? 20, 50);
    const skip = query.skip ?? 0;

    const orders = await this.prisma.order.findMany({
      where: {
        items: { some: { product: { sellerId } } },
        ...(query.status ? { status: query.status } : {}),
      },
      take,
      skip,
      orderBy: { createdAt: 'desc' },
      include: orderInclude,
    });

    return orders;
  }

  async updateStatus(
    orderId: string,
    userId: string,
    role: string,
    status: OrderStatus,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });
    if (!order) throw new NotFoundException('Order not found');

    const isSeller = order.items.some(
      (item) => item.product.sellerId === userId,
    );
    const isBuyer = order.buyerId === userId;

    if (!isSeller && !isBuyer && role !== Role.ADMIN) {
      throw new ForbiddenException('Access denied');
    }

    if (isBuyer && !isSeller && role !== Role.ADMIN) {
      if (status !== OrderStatus.CANCELLED) {
        throw new ForbiddenException('Buyers can only cancel orders');
      }
      if (
        order.status !== OrderStatus.PENDING &&
        order.status !== OrderStatus.CONFIRMED
      ) {
        throw new BadRequestException(
          'Order can only be cancelled when pending or confirmed',
        );
      }
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: orderInclude,
    });

    if (status === OrderStatus.CANCELLED) {
      for (const item of order.items) {
        await this.prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    return updated;
  }
}
