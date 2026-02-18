import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CreateTransactionRequestDto } from "./dto/create-transaction.dto.js";
import { UpdateTransactionRequestDto } from "./dto/update-transaction.dto.js";
import { InventoryService } from "./inventory.service.js";

@Controller()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post("/transactions")
  public createTransaction(@Body() body: CreateTransactionRequestDto) {
    return this.inventoryService.addTransaction({
      productName: body.productName,
      type: body.type,
      price: body.price,
      amount: body.amount,
      at: new Date(body.at),
    });
  }

  @Get("/transactions/:id")
  public getTransaction(@Param("id") id: string) {
    return this.inventoryService.getTransaction(id);
  }

  @Patch("/transactions/:id")
  public updateTransaction(
    @Param("id") id: string,
    @Body() body: UpdateTransactionRequestDto,
  ) {
    return this.inventoryService.updateTransaction(id, {
      productName: body.productName,
      type: body.type,
      price: body.price,
      amount: body.amount,
      at: body.at ? new Date(body.at) : undefined,
    });
  }

  @Delete("/transactions/:id")
  public deleteTransaction(@Param("id") id: string) {
    this.inventoryService.deleteTransaction(id);
  }

  @Get("/products/:productName/summary")
  public getProductSummary(@Param("productName") productName: string) {
    return this.inventoryService.getProductSummary(productName);
  }

  @Post("/admin/clear")
  public clear() {
    this.inventoryService.clear();
  }
}
