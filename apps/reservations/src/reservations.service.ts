import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservation.repository';
import { Types } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { PAYMENT_SERVICE } from '@app/common';
import { map } from "rxjs"
@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    @Inject(PAYMENT_SERVICE) private readonly paymentClient: ClientProxy
  ) { }

  async create(createReservationDto: CreateReservationDto, userId: string) {

    return this.paymentClient
      .send('create_charge', createReservationDto.charge)
      .pipe(
        map((paymentIntent) => {
          return this.reservationRepository.create({
            ...createReservationDto,
            timeStamp: new Date(),
            userId,
            invoiceId: paymentIntent.id, 
          });
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
    return this.reservationRepository.findOndAndDelete({ _id: new Types.ObjectId(_id) });
  }
}
