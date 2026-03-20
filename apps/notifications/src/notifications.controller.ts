import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { NotifyReservationCreatedDto } from './dtos/notify-reservation-created.dto';
import { NotifyPaymentConfirmedDto } from './dtos/notify-reservation-confirmed.dto';
import { NotifyReservationCancelledDto } from './dtos/notify-reservation-cancelled.dto';

@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

 
  @EventPattern('reservation_created')
  async handleReservationCreated(
    @Payload() data: NotifyReservationCreatedDto,
    @Ctx() context: RmqContext,
  ) {
    await this.notificationsService.sendReservationConfirmation(data);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }


  @EventPattern('payment_confirmed')
  async handlePaymentConfirmed(
    @Payload() data: NotifyPaymentConfirmedDto,
    @Ctx() context: RmqContext,
  ) {
    await this.notificationsService.sendPaymentReceipt(data);
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }

 
  @EventPattern('reservation_cancelled')
  async handleReservationCancelled(
    @Payload() data: NotifyReservationCancelledDto,
    @Ctx() context: RmqContext,
  ) {
    await this.notificationsService.sendCancellationNotice(data);
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}