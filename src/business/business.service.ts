import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string, role: string) {
    if (role !== Role.BUSINESS) {
      throw new ForbiddenException('Business profile only for business accounts');
    }
    const profile = await this.prisma.businessProfile.findUnique({
      where: { userId },
      include: { user: { select: { email: true, name: true, phone: true } } },
    });
    if (!profile) throw new NotFoundException('Business profile not found');
    return profile;
  }

  async updateProfile(userId: string, role: string, dto: UpdateBusinessDto) {
    if (role !== Role.BUSINESS) {
      throw new ForbiddenException('Business profile only for business accounts');
    }
    return this.prisma.businessProfile.update({
      where: { userId },
      data: {
        organizationName: dto.organizationName,
        description: dto.description,
        website: dto.website,
      },
    });
  }
}
