import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ListingType, Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { boundingBox, haversineKm } from '../common/utils/geo';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { ListingQueryDto } from './dto/listing-query.dto';

const ownerSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  businessProfile: { select: { organizationName: true, verified: true } },
} as const;

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, role: string, dto: CreateListingDto) {
    if (role !== Role.BUSINESS && role !== Role.ADMIN) {
      throw new ForbiddenException('Only business accounts can create listings');
    }
    if (dto.type === ListingType.BLOOD_DONOR) {
      throw new ForbiddenException(
        'Donor profiles are created via the blood donor registration endpoint',
      );
    }
    return this.prisma.listing.create({
      data: {
        type: dto.type,
        title: dto.title,
        description: dto.description,
        address: dto.address,
        latitude: dto.latitude,
        longitude: dto.longitude,
        contactEmail: dto.contactEmail,
        contactPhone: dto.contactPhone,
        metadata: (dto.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
        published: dto.published ?? true,
        ownerId,
      },
      include: { owner: { select: ownerSelect } },
    });
  }

  async update(id: string, ownerId: string, role: string, dto: UpdateListingDto) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.ownerId !== ownerId && role !== Role.ADMIN) {
      throw new ForbiddenException('You do not own this listing');
    }
    return this.prisma.listing.update({
      where: { id },
      data: {
        ...dto,
        metadata:
          dto.metadata === undefined
            ? undefined
            : (dto.metadata as Prisma.InputJsonValue),
      },
      include: { owner: { select: ownerSelect } },
    });
  }

  async remove(id: string, ownerId: string, role: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.ownerId !== ownerId && role !== Role.ADMIN) {
      throw new ForbiddenException('You do not own this listing');
    }
    await this.prisma.listing.delete({ where: { id } });
    return { deleted: true, id };
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findFirst({
      where: { id, published: true },
      include: { owner: { select: ownerSelect } },
    });
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  async findMine(ownerId: string) {
    return this.prisma.listing.findMany({
      where: { ownerId },
      orderBy: { updatedAt: 'desc' },
      include: { owner: { select: ownerSelect } },
    });
  }

  /**
   * Public search with optional geo + blood group filter on metadata.
   */
  async searchPublic(query: ListingQueryDto) {
    const take = query.take ?? 40;
    const skip = query.skip ?? 0;
    const where: Prisma.ListingWhereInput = {
        published: true,
        ...(query.type ? { type: query.type } : {}),
        ...(query.lat != null &&
        query.lng != null &&
        (query.radiusKm ?? 0) > 0
          ? {
              latitude: {
                gte: boundingBox(
                  query.lat,
                  query.lng,
                  query.radiusKm ?? 25,
                ).minLat,
                lte: boundingBox(
                  query.lat,
                  query.lng,
                  query.radiusKm ?? 25,
                ).maxLat,
              },
              longitude: {
                gte: boundingBox(
                  query.lat,
                  query.lng,
                  query.radiusKm ?? 25,
                ).minLng,
                lte: boundingBox(
                  query.lat,
                  query.lng,
                  query.radiusKm ?? 25,
                ).maxLng,
              },
            }
          : {}),
      };

    let rows = await this.prisma.listing.findMany({
      where,
      take: Math.min(take * 3, 200),
      skip,
      orderBy: { createdAt: 'desc' },
      include: { owner: { select: ownerSelect } },
    });

    if (
      query.lat != null &&
      query.lng != null &&
      (query.radiusKm ?? 0) > 0
    ) {
      const r = query.radiusKm ?? 25;
      rows = rows.filter((l) => {
        if (l.latitude == null || l.longitude == null) return false;
        return haversineKm(query.lat!, query.lng!, l.latitude, l.longitude) <= r;
      });
    }

    if (query.bloodGroup) {
      const g = query.bloodGroup.toUpperCase();
      rows = rows.filter((l) => {
        const meta = l.metadata as Record<string, unknown> | null;
        const bg = String(meta?.bloodGroup ?? '').toUpperCase();
        return bg === g;
      });
    }

    rows = rows.slice(0, take);

    const withDistance =
      query.lat != null && query.lng != null
        ? rows.map((l) => ({
            ...l,
            distanceKm:
              l.latitude != null && l.longitude != null
                ? Math.round(
                    haversineKm(
                      query.lat!,
                      query.lng!,
                      l.latitude,
                      l.longitude,
                    ) * 10,
                  ) / 10
                : null,
          }))
        : rows.map((l) => ({ ...l, distanceKm: null as number | null }));

    return withDistance;
  }
}
