/**
 * Copyright (c) 2026 Myia. Licensed under the MIT License.
 */
import { readFileSync } from "node:fs";

/**
 * The version of Heal, read from the package's own `package.json`: one place holds it.
 * The file is one folder above this module, both in the sources (`src/`) and in the build (`dist/`).
 */
const manifest = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
  version: string;
};

export const VERSION: string = manifest.version;
