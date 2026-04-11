import { ForbiddenException, Injectable } from '@nestjs/common';
import { ListingType, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { haversineKm } from '../common/utils/geo';
import { ListingsService } from '../listings/listings.service';
import { RegisterDonorDto } from './dto/register-donor.dto';
import { BloodSearchDto } from './dto/blood-search.dto';
import { AiSuggestDto, UrgencyLevel } from './dto/ai-suggest.dto';

@Injectable()
export class BloodService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly listings: ListingsService,
  ) {}

  async registerDonor(userId: string, role: string, dto: RegisterDonorDto) {
    if (role !== Role.USER && role !== Role.ADMIN) {
      throw new ForbiddenException(
        'Only normal user accounts can register as donors',
      );
    }
    const bloodGroup = dto.bloodGroup.toUpperCase();
    const existing = await this.prisma.listing.findFirst({
      where: { ownerId: userId, type: ListingType.BLOOD_DONOR },
    });
    const metadata = {
      bloodGroup,
      available: dto.available ?? true,
      notes: dto.notes ?? null,
    };
    if (existing) {
      return this.prisma.listing.update({
        where: { id: existing.id },
        data: {
          title: `Blood donor — ${bloodGroup}`,
          description:
            dto.notes ??
            'Registered LifeLink donor. Contact via LifeLink messaging.',
          address: dto.address,
          latitude: dto.latitude,
          longitude: dto.longitude,
          metadata,
          published: true,
        },
      });
    }
    return this.prisma.listing.create({
      data: {
        type: ListingType.BLOOD_DONOR,
        title: `Blood donor — ${bloodGroup}`,
        description:
          dto.notes ??
          'Registered LifeLink donor willing to help in emergencies.',
        address: dto.address,
        latitude: dto.latitude,
        longitude: dto.longitude,
        metadata,
        ownerId: userId,
        published: true,
      },
    });
  }

  async search(dto: BloodSearchDto) {
    const donors = await this.listings.searchPublic({
      type: ListingType.BLOOD_DONOR,
      lat: dto.lat,
      lng: dto.lng,
      radiusKm: dto.radiusKm ?? 25,
      bloodGroup: dto.bloodGroup,
      take: 50,
    });
    const banks = await this.listings.searchPublic({
      type: ListingType.BLOOD_BANK,
      lat: dto.lat,
      lng: dto.lng,
      radiusKm: dto.radiusKm ?? 25,
      take: 50,
    });
    return { donors, banks };
  }

  urgencyWeight(u: UrgencyLevel | undefined): number {
    switch (u) {
      case UrgencyLevel.CRITICAL:
        return 2.5;
      case UrgencyLevel.HIGH:
        return 2;
      case UrgencyLevel.MEDIUM:
        return 1.4;
      case UrgencyLevel.LOW:
        return 1;
      default:
        return 1.2;
    }
  }

  /**
   * Future AI ranking: combine distance, availability, and urgency.
   * Lower score is better (distance-dominated, urgency reduces effective distance).
   */
  async aiSuggest(dto: AiSuggestDto) {
    const radius = dto.radiusKm ?? 40;
    const donors = (await this.listings.searchPublic({
      type: ListingType.BLOOD_DONOR,
      lat: dto.lat,
      lng: dto.lng,
      radiusKm: radius,
      bloodGroup: dto.bloodGroup,
      take: 80,
    })) as Array<{
      id: string;
      latitude: number | null;
      longitude: number | null;
      metadata: unknown;
      distanceKm: number | null;
      title: string;
    }>;

    const w = this.urgencyWeight(dto.urgency);

    const ranked = donors
      .filter((d) => d.latitude != null && d.longitude != null)
      .map((d) => {
        const meta = d.metadata as Record<string, unknown> | null;
        const available = meta?.available !== false;
        const dist =
          d.distanceKm ??
          haversineKm(dto.lat, dto.lng, d.latitude!, d.longitude!);
        const availabilityBoost = available ? 0.85 : 1.15;
        const score = (dist * availabilityBoost) / w;
        return {
          listingId: d.id,
          title: d.title,
          distanceKm: Math.round(dist * 10) / 10,
          available,
          score: Math.round(score * 100) / 100,
          reason: `Ranked by proximity (${dist} km), availability, and urgency weight ${w}.`,
        };
      })
      .sort((a, b) => a.score - b.score)
      .slice(0, 12);

    return {
      model: 'heuristic-v1',
      urgency: dto.urgency ?? UrgencyLevel.MEDIUM,
      suggestions: ranked,
      disclaimer:
        'This is a deterministic preview ranking (not a medical device). Always verify eligibility with donors and facilities.',
    };
  }
}
