import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { loadEnv } from "./config/load-env.js";
import { InventoryExceptionFilter } from "./inventory/errors/inventory-exception.filter.js";
import { InventoryModule } from "./inventory/inventory.module.js";

loadEnv();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(InventoryModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new InventoryExceptionFilter());
  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
}

void bootstrap();
