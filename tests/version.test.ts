/**
 * Copyright (c) 2026 Myia. Licensed under the MIT License.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { VERSION } from "../src/version.js";

describe("VERSION", () => {
  it("is the version of package.json", () => {
    const manifest = JSON.parse(
      readFileSync(new URL("../package.json", import.meta.url), "utf8"),
    ) as {
      version: string;
    };
    expect(VERSION).toBe(manifest.version);
  });
});
