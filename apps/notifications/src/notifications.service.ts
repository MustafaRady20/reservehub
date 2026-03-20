import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { NotifyReservationCreatedDto } from './dtos/notify-reservation-created.dto';
import { NotifyPaymentConfirmedDto } from './dtos/notify-reservation-confirmed.dto';
import { NotifyReservationCancelledDto } from './dtos/notify-reservation-cancelled.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.getOrThrow('SMTP_HOST'),
      port: configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: configService.getOrThrow('SMTP_USER'),
        pass: configService.getOrThrow('SMTP_PASS'),
      },
    });
  }

  async sendReservationConfirmation(data: NotifyReservationCreatedDto) {
    this.logger.log(`Sending reservation confirmation to ${data.email}`);

    await this.transporter.sendMail({
      from: this.configService.getOrThrow('EMAIL_FROM'),
      to: data.email,
      subject: `Reservation Confirmed – ${data.placeId}`,
      html: `
        <h2>Your reservation is confirmed!</h2>
        <p>Hi ${data.name},</p>
        <p>Your reservation at <strong>${data.placeId}</strong> has been confirmed.</p>
        <ul>
          <li><strong>Check-in:</strong> ${new Date(data.startDate).toDateString()}</li>
          <li><strong>Check-out:</strong> ${new Date(data.endDate).toDateString()}</li>
          <li><strong>Reservation ID:</strong> ${data.reservationId}</li>
        </ul>
        <p>Thank you for choosing ReserveHub!</p>
      `,
    });
  }

  async sendPaymentReceipt(data: NotifyPaymentConfirmedDto) {
    this.logger.log(`Sending payment receipt to ${data.email}`);

    await this.transporter.sendMail({
      from: this.configService.getOrThrow('EMAIL_FROM'),
      to: data.email,
      subject: `Payment Receipt – $${data.amount}`,
      html: `
        <h2>Payment Received</h2>
        <p>Hi ${data.name},</p>
        <p>We've received your payment of <strong>$${data.amount} USD</strong>.</p>
        <ul>
          <li><strong>Reservation ID:</strong> ${data.reservationId}</li>
          <li><strong>Invoice ID:</strong> ${data.invoiceId}</li>
          <li><strong>Date:</strong> ${new Date().toDateString()}</li>
        </ul>
        <p>Keep this email as your receipt. Safe travels!</p>
      `,
    });
  }

  async sendCancellationNotice(data: NotifyReservationCancelledDto) {
    this.logger.log(`Sending cancellation notice to ${data.email}`);

    await this.transporter.sendMail({
      from: this.configService.getOrThrow('EMAIL_FROM'),
      to: data.email,
      subject: `Reservation Cancelled – ${data.placeId}`,
      html: `
        <h2>Reservation Cancelled</h2>
        <p>Hi ${data.name},</p>
        <p>Your reservation at <strong>${data.placeId}</strong> has been cancelled.</p>
        <ul>
          <li><strong>Reservation ID:</strong> ${data.reservationId}</li>
          <li><strong>Cancelled on:</strong> ${new Date().toDateString()}</li>
        </ul>
        <p>If this was a mistake, please create a new reservation. We hope to see you again!</p>
      `,
    });
  }
}