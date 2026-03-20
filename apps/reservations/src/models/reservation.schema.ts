import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false })
export class ReservationDocument extends AbstractDocument {
  @Prop()
  timeStamp: Date;
  @Prop()
  startDate: Date;
  @Prop()
  endDate: Date;

  @Prop({type:Types.ObjectId,ref:"User"})
  userId: Types.ObjectId;

  @Prop({type:Types.ObjectId,ref:"Place"})
  placeId: Types.ObjectId;

  @Prop()
  invoiceId: string;
}

export const ReservationSchema = SchemaFactory.createForClass(ReservationDocument)
