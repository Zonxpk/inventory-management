import { config } from "dotenv";
import { resolve } from "node:path";

export function loadEnv(): void {
  const originalEnv = { ...process.env };

  const candidateFiles = [
    resolve(process.cwd(), ".env"),
    resolve(process.cwd(), ".env.local"),
    resolve(process.cwd(), "..", ".env"),
    resolve(process.cwd(), "..", ".env.local"),
  ];

  for (const envPath of candidateFiles) {
    config({ path: envPath, override: true });
  }

  for (const [key, value] of Object.entries(originalEnv)) {
    if (value !== undefined) {
      process.env[key] = value;
    }
  }
}
