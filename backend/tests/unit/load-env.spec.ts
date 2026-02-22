import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { loadEnv } from "../../src/config/load-env.js";

describe("loadEnv", () => {
  const originalCwd = process.cwd();
  const originalCustomVar = process.env.TEST_ONLY_DB_URL;

  let tempRootDir = "";
  let tempBackendDir = "";

  beforeEach(() => {
    tempRootDir = fs.mkdtempSync(path.join(os.tmpdir(), "inventory-env-root-"));
    tempBackendDir = path.join(tempRootDir, "backend");
    fs.mkdirSync(tempBackendDir, { recursive: true });

    process.chdir(tempBackendDir);
    delete process.env.TEST_ONLY_DB_URL;
  });

  afterEach(() => {
    process.chdir(originalCwd);
    fs.rmSync(tempRootDir, { recursive: true, force: true });

    if (originalCustomVar === undefined) {
      delete process.env.TEST_ONLY_DB_URL;
    } else {
      process.env.TEST_ONLY_DB_URL = originalCustomVar;
    }
  });

  it("loads env files from cwd and parent paths", () => {
    fs.writeFileSync(
      path.join(tempBackendDir, ".env"),
      "TEST_ONLY_DB_URL=cwd-env\n",
    );
    fs.writeFileSync(
      path.join(tempBackendDir, ".env.local"),
      "TEST_ONLY_DB_URL=cwd-local\n",
    );
    fs.writeFileSync(
      path.join(tempRootDir, ".env"),
      "TEST_ONLY_DB_URL=root-env\n",
    );
    fs.writeFileSync(
      path.join(tempRootDir, ".env.local"),
      "TEST_ONLY_DB_URL=root-local\n",
    );

    loadEnv();

    expect(process.env.TEST_ONLY_DB_URL).toBe("root-local");
  });

  it("keeps env undefined when no files exist", () => {
    loadEnv();

    expect(process.env.TEST_ONLY_DB_URL).toBeUndefined();
  });
});
