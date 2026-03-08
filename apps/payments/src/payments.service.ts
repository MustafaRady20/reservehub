import { createChargeDto } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {

  private readonly logger = new Logger(PaymentsService.name);
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.getOrThrow('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2026-01-28.clover',
      },
    );
  }

  async createCharge({ card, amount }: createChargeDto): Promise<Stripe.PaymentIntent> {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: card.number,
        exp_month: card.exp_month,
        exp_year: card.exp_year,
        cvc: card.cvc,
      },
    });

    this.logger.log(`PaymentMethod created: ${paymentMethod.id}`);

    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: paymentMethod.id,
      amount: amount * 100, 
      currency: 'usd',
      confirm: true,
      payment_method_types: ['card'],
    });

    this.logger.log(
      `PaymentIntent ${paymentIntent.id} status: ${paymentIntent.status}`,
    );

    return paymentIntent;
  }
}
