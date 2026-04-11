import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BusinessModule } from './business/business.module';
import { ListingsModule } from './listings/listings.module';
import { BloodModule } from './blood/blood.module';
import { MapModule } from './map/map.module';
import { NewsModule } from './news/news.module';
import { JobsModule } from './jobs/jobs.module';
import { HealthController } from './health.controller';

/** Prefer project-root `.env` next to `dist/` so `JWT_*` load even when `cwd` is not `lifelink_b`. */
const envFileCandidates = [
  join(__dirname, '..', '.env'),
  join(process.cwd(), '.env'),
];
const envFilePath = [...new Set(envFileCandidates.filter((p) => existsSync(p)))];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePath.length > 0 ? envFilePath : '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    BusinessModule,
    ListingsModule,
    BloodModule,
    MapModule,
    NewsModule,
    JobsModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
