import { Injectable } from '@nestjs/common';
import { ListingType } from '@prisma/client';
import { ListingsService } from '../listings/listings.service';
import { MapMarkersDto } from './dto/map-markers.dto';

export type MapMarker = {
  id: string;
  type: ListingType;
  title: string;
  lat: number;
  lng: number;
  color: 'red' | 'blue' | 'green' | 'amber' | 'violet';
  distanceKm: number | null;
};

@Injectable()
export class MapService {
  constructor(private readonly listings: ListingsService) {}

  colorForType(t: ListingType): MapMarker['color'] {
    switch (t) {
      case ListingType.BLOOD_BANK:
      case ListingType.BLOOD_DONOR:
        return 'red';
      case ListingType.CLINIC:
        return 'blue';
      case ListingType.PHARMACY:
        return 'green';
      case ListingType.JOB:
        return 'amber';
      case ListingType.TEACHER:
        return 'violet';
      default:
        return 'amber';
    }
  }

  async markers(dto: MapMarkersDto) {
    const items = await this.listings.searchPublic({
      type: dto.type,
      lat: dto.lat,
      lng: dto.lng,
      radiusKm: dto.radiusKm ?? 30,
      take: 150,
    });
    return items
      .filter((l) => l.latitude != null && l.longitude != null)
      .map((l) => ({
        id: l.id,
        type: l.type,
        title: l.title,
        lat: l.latitude as number,
        lng: l.longitude as number,
        color: this.colorForType(l.type),
        distanceKm: l.distanceKm ?? null,
      }));
  }
}
