export class CreateReservationDto {
  userId: string;

  placeId: string;

  invoiceId: string;

  startDate: Date;
  endDate: Date;
}
