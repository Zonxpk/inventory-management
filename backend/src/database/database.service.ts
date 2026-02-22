import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { Pool } from "pg";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly databaseUrl =
    process.env.PRISMA_DATABASE_URL ?? process.env.POSTGRES_URL;

  private pool: Pool | null = null;

  async onModuleInit(): Promise<void> {
    if (!this.databaseUrl) {
      throw new Error(
        "Missing database URL. Set PRISMA_DATABASE_URL or POSTGRES_URL in env.",
      );
    }

    this.pool = new Pool({ connectionString: this.databaseUrl });
    await this.pool.query("SELECT 1");
    this.logger.log("Database connection established");
  }

  async onModuleDestroy(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }

  getPool(): Pool {
    if (!this.pool) {
      throw new Error("Database pool is not initialized");
    }

    return this.pool;
  }
}
