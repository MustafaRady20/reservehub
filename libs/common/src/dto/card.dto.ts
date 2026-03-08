import { IsCreditCard, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CardDto{
    @IsCreditCard()
    @IsNotEmpty()
    number: string;
    @IsNumber()
    exp_month: number;
    @IsNumber()
    exp_year: number;
    @IsNotEmpty()
    @IsString()
    cvc: string;
}