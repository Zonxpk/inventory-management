import { config } from "dotenv";
import { resolve } from "node:path";

export function loadEnv(): void {
  const candidateFiles = [
    resolve(process.cwd(), ".env"),
    resolve(process.cwd(), ".env.local"),
    resolve(process.cwd(), "..", ".env"),
    resolve(process.cwd(), "..", ".env.local"),
  ];

  for (const envPath of candidateFiles) {
    config({ path: envPath, override: true });
  }
}
