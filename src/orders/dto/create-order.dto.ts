import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @MinLength(5)
  shippingAddress!: string;

  @IsString()
  @MinLength(5)
  contactPhone!: string;

  @IsOptional()
  @IsString()
  note?: string;
}
