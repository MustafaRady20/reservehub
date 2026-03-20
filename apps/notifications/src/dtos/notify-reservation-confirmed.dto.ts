import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class NotifyPaymentConfirmedDto {
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
  invoiceId: string;

  @IsNumber()
  amount: number;
}