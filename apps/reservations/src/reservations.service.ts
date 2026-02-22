import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservation.repository';
import { Types } from 'mongoose';

@Injectable()
export class ReservationsService {
  constructor(private readonly reservationRepository:ReservationRepository){}

  async create(createReservationDto: CreateReservationDto,userId:string) {
    return this.reservationRepository.create({
      ...createReservationDto,
      timeStamp: new Date(),
      userId: userId
    });
  }

  findAll() {
    return this.reservationRepository.find({});
  }

  findOne(_id: string) {
    return this.reservationRepository.findone({_id:new Types.ObjectId(_id)});
  }

  update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOndAndUpdate({_id:new Types.ObjectId(_id)},{$set:updateReservationDto});
  }

  remove(_id: string) {
    return this.reservationRepository.findOndAndDelete({_id:new Types.ObjectId(_id)});
  }
}
