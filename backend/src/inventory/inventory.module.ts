import { Module } from "@nestjs/common";
import { InventoryController } from "./inventory.controller.js";
import { InventoryService } from "./inventory.service.js";
import { InventoryState } from "./inventory.state.js";
import { LedgerRecomputeService } from "./services/ledger-recompute.service.js";
import { ProductSummaryService } from "./services/product-summary.service.js";

@Module({
  controllers: [InventoryController],
  providers: [
    InventoryState,
    LedgerRecomputeService,
    ProductSummaryService,
    InventoryService,
  ],
  exports: [InventoryService],
})
export class InventoryModule {}
