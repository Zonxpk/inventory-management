import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";
import { TransactionType } from "../entities/transaction.types.js";

export class UpdateTransactionRequestDto {
  @IsOptional()
  @IsString()
  public productName?: string;

  @IsOptional()
  @IsEnum(["BUY", "SELL"])
  public type?: TransactionType;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  public price?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  public amount?: number;

  @IsOptional()
  @IsDateString()
  public at?: string;
}
