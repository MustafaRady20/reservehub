import { createChargeDto } from '@app/common';
import { Type } from 'class-transformer';
import { IsDate, IsDefined, IsNotEmpty, IsNotEmptyObject, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsString()
  placeId: string;

  
  @IsDate()
  @Type(() => Date)
  startDate: Date;
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => createChargeDto)
  charge: createChargeDto;


}
