import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { loadEnv } from "./config/load-env.js";
import { InventoryModule } from "./inventory/inventory.module.js";

loadEnv();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(InventoryModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(3001);
}

void bootstrap();
