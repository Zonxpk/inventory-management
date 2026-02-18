import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from "class-validator";
import { TransactionType } from "../entities/transaction.types.js";

export class CreateTransactionRequestDto {
  @IsNotEmpty()
  public productName!: string;

  @IsEnum(["BUY", "SELL"])
  public type!: TransactionType;

  @IsNumber()
  @IsPositive()
  public price!: number;

  @IsNumber()
  @IsPositive()
  public amount!: number;

  @IsDateString()
  public at!: string;
}
