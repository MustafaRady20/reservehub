import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  constructor(private readonly configService: ConfigService) {
       const stripe = new Stripe(this.configService.getOrThrow("STRIPE_SECRET_KEY"));
  }


  getHello(): string {
    return 'Hello World!';
  }
}
