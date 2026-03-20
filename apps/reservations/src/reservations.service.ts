import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservation.repository';
import { Types } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATION_SERVICE, PAYMENT_SERVICE, UserDto } from '@app/common';
import { map } from "rxjs"
@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    @Inject(PAYMENT_SERVICE) private readonly paymentClient: ClientProxy,
    @Inject(NOTIFICATION_SERVICE) private readonly notificationClient: ClientProxy,
  ) { }

  async create(createReservationDto: CreateReservationDto, user:UserDto) {

    this.paymentClient
      .send('create_charge', createReservationDto.charge)
      .pipe(
        map(async (paymentIntent) => {
          const reservation = await this.reservationRepository.create({
            ...createReservationDto,
            timeStamp: new Date(),
            userId:new Types.ObjectId(user._id),
            placeId:new Types.ObjectId(createReservationDto.placeId),
            invoiceId: paymentIntent.id,
          });

          this.notificationClient.emit('reservation_created', {
            reservationId: reservation._id.toString(),
            placeId: reservation.placeId,
            startDate: reservation.startDate,
            endDate: reservation.endDate,
            email: user?.email,
            name: user?.name,
          });

          // Also emit payment_confirmed
          this.notificationClient.emit('payment_confirmed', {
            reservationId: reservation._id.toString(),
            invoiceId: reservation.invoiceId,
            amount: createReservationDto.charge.amount,
            email: user.email,
            name: user.name,
          });

          return reservation;
        }),

      );


  }

  async findAll() {
    return this.reservationRepository.find({});
  }

  async findOne(_id: string) {
    return this.reservationRepository.findone({ _id: new Types.ObjectId(_id) });
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOndAndUpdate({ _id: new Types.ObjectId(_id) }, { $set: updateReservationDto });
  }

  async remove(_id: string) {
    const reservation = await this.reservationRepository.findOndAndDelete({ _id: new Types.ObjectId(_id) });

    this.notificationClient.emit('reservation_cancelled', {
      reservationId: reservation._id.toString(),
      placeId: (reservation as any).placeId,
      email: (reservation as any).userId.email,
      name: (reservation as any).userId.name,
    });

    return reservation;
  }
}
