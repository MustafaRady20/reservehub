import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class NotifyReservationCancelledDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  reservationId: string;

  @IsNotEmpty()
  @IsString()
  placeId: string;
}