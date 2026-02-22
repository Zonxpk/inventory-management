import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DatabaseService } from "../../src/database/database.service.js";

const queryMock = vi.fn(async () => ({ rows: [] }));
const endMock = vi.fn(async () => undefined);
const poolConstructorMock = vi.fn(() => ({
  query: queryMock,
  end: endMock,
}));

vi.mock("pg", () => ({
  Pool: poolConstructorMock,
}));

describe("DatabaseService", () => {
  const originalPrisma = process.env.PRISMA_DATABASE_URL;
  const originalPostgres = process.env.POSTGRES_URL;

  beforeEach(() => {
    queryMock.mockClear();
    endMock.mockClear();
    poolConstructorMock.mockClear();
    process.env.PRISMA_DATABASE_URL = "postgres://example/prisma";
    delete process.env.POSTGRES_URL;
  });

  afterEach(() => {
    if (originalPrisma === undefined) {
      delete process.env.PRISMA_DATABASE_URL;
    } else {
      process.env.PRISMA_DATABASE_URL = originalPrisma;
    }

    if (originalPostgres === undefined) {
      delete process.env.POSTGRES_URL;
    } else {
      process.env.POSTGRES_URL = originalPostgres;
    }
  });

  it("connects using PRISMA_DATABASE_URL and pings DB on init", async () => {
    const service = new DatabaseService();

    await service.onModuleInit();

    expect(poolConstructorMock).toHaveBeenCalledWith({
      connectionString: "postgres://example/prisma",
    });
    expect(queryMock).toHaveBeenCalledWith("SELECT 1");
  });

  it("falls back to POSTGRES_URL when PRISMA_DATABASE_URL is missing", async () => {
    delete process.env.PRISMA_DATABASE_URL;
    process.env.POSTGRES_URL = "postgres://example/postgres";

    const service = new DatabaseService();

    await service.onModuleInit();

    expect(poolConstructorMock).toHaveBeenCalledWith({
      connectionString: "postgres://example/postgres",
    });
  });

  it("throws when no database URL exists", async () => {
    delete process.env.PRISMA_DATABASE_URL;
    delete process.env.POSTGRES_URL;

    const service = new DatabaseService();

    await expect(service.onModuleInit()).rejects.toThrow(
      "Missing database URL",
    );
  });

  it("returns initialized pool from getPool", async () => {
    const service = new DatabaseService();
    await service.onModuleInit();

    const pool = service.getPool();

    expect(pool.query).toBe(queryMock);
  });

  it("throws when getPool is called before initialization", () => {
    const service = new DatabaseService();

    expect(() => service.getPool()).toThrow("Database pool is not initialized");
  });

  it("closes pool on module destroy", async () => {
    const service = new DatabaseService();
    await service.onModuleInit();

    await service.onModuleDestroy();

    expect(endMock).toHaveBeenCalledTimes(1);
    expect(() => service.getPool()).toThrow("Database pool is not initialized");
  });
});
