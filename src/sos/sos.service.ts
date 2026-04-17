import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { boundingBox, haversineKm } from '../common/utils/geo';
import { CreateSosDto } from './dto/create-sos.dto';
import { SosNearbyDto } from './dto/sos-nearby.dto';

const DEFAULT_RADIUS_KM = 5;
const ALERT_TTL_MS = 6 * 60 * 60 * 1000;
const CREATE_COOLDOWN_MS = 90_000;

export type SosNearbyItem = {
  id: string;
  authorId: string;
  lat: number;
  lng: number;
  message: string | null;
  createdAt: string;
  authorName: string;
  distanceKm: number;
};

@Injectable()
export class SosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateSosDto) {
    const now = Date.now();
    const recent = await this.prisma.sosAlert.findFirst({
      where: {
        userId,
        createdAt: { gte: new Date(now - CREATE_COOLDOWN_MS) },
      },
      select: { id: true },
    });
    if (recent) {
      throw new BadRequestException(
        'অল্পক্ষণ অপেক্ষা করুন — আবার SOS পাঠানোর আগে কিছু সময় লাগবে।',
      );
    }

    const expiresAt = new Date(now + ALERT_TTL_MS);
    return this.prisma.sosAlert.create({
      data: {
        userId,
        latitude: dto.lat,
        longitude: dto.lng,
        message: dto.message?.trim() ? dto.message.trim() : null,
        expiresAt,
      },
      select: {
        id: true,
        latitude: true,
        longitude: true,
        message: true,
        createdAt: true,
        expiresAt: true,
      },
    });
  }

  async nearby(query: SosNearbyDto): Promise<SosNearbyItem[]> {
    const r = query.radiusKm ?? DEFAULT_RADIUS_KM;
    const now = new Date();
    const box = boundingBox(query.lat, query.lng, r);

    const rows = await this.prisma.sosAlert.findMany({
      where: {
        expiresAt: { gt: now },
        latitude: { gte: box.minLat, lte: box.maxLat },
        longitude: { gte: box.minLng, lte: box.maxLng },
      },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 80,
    });

    return rows
      .map((row) => {
        const distanceKm = haversineKm(
          query.lat,
          query.lng,
          row.latitude,
          row.longitude,
        );
        return {
          id: row.id,
          authorId: row.userId,
          lat: row.latitude,
          lng: row.longitude,
          message: row.message,
          createdAt: row.createdAt.toISOString(),
          authorName: row.user.name,
          distanceKm,
        };
      })
      .filter((item) => item.distanceKm <= r);
  }
}
