/**
 * Copyright (c) 2026 Myia. Licensed under the MIT License.
 */

/**
 * The CHANGELOG check of a pull request: every pull request says what a user of Heal will see,
 * or says that there is nothing to see, and why.
 *
 * A pull request passes when one of these is true:
 * - it adds at least one entry under `## [Unreleased]` in `CHANGELOG.md`;
 * - it cuts a release (a new version section appears);
 * - one of its commits carries the trailer `No-Changelog: <reason>`.
 *
 * It fails, whatever else is true, when it edits a section that was already released.
 *
 * The decision is a pure function (`checkChangelog`), tested without git. The command around it
 * reads the two versions of the file and the commit messages from git:
 *
 *   node --experimental-strip-types scripts/changelog-check.ts --base origin/main --head HEAD
 */
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

export const CHANGELOG = "CHANGELOG.md";
const SKILL = ".claude/skills/update-changelog/SKILL.md";
const UNRELEASED = /^## \[unreleased\]/i;
const TRAILER = /^No-Changelog:[ \t]*(\S.*)$/im;

export interface ChangelogInput {
  /** `CHANGELOG.md` where the pull request starts, or `null` when the file did not exist. */
  base: string | null;
  /** `CHANGELOG.md` at the head of the pull request, or `null` when the file does not exist. */
  head: string | null;
  /** The full message of each commit of the pull request. */
  commitMessages: readonly string[];
}

export interface ChangelogCheck {
  pass: boolean;
  message: string;
}

/** The `## [...]` sections of a changelog: the heading line, and the lines under it. */
export const sectionsOf = (text: string): Map<string, string[]> => {
  const sections = new Map<string, string[]>();
  let current: string[] | null = null;
  for (const line of text.split("\n")) {
    if (line.startsWith("## [")) {
      current = [];
      sections.set(line.trim(), current);
    } else {
      current?.push(line.trimEnd());
    }
  }
  return sections;
};

const unreleasedOf = (sections: Map<string, string[]>): string[] => {
  for (const [heading, lines] of sections) {
    if (UNRELEASED.test(heading)) {
      return lines;
    }
  }
  return [];
};

const isEntry = (line: string): boolean => /^\s*[-*] \S/.test(line);

const sameLines = (left: readonly string[], right: readonly string[]): boolean =>
  left.join("\n").trim() === right.join("\n").trim();

const HOW_TO = [
  "Do one of these:",
  `  - add a line under "## [Unreleased]" in ${CHANGELOG} (the steps are in ${SKILL});`,
  '  - or, when no user of Heal can see the change, add this trailer to a commit message: "No-Changelog: <reason>".',
].join("\n");

export const checkChangelog = (input: ChangelogInput): ChangelogCheck => {
  if (input.head === null) {
    return { pass: false, message: `${CHANGELOG} is missing at the head of this pull request.` };
  }
  const base = sectionsOf(input.base ?? "");
  const head = sectionsOf(input.head);

  for (const [heading, lines] of base) {
    if (UNRELEASED.test(heading)) {
      continue;
    }
    const now = head.get(heading);
    if (now === undefined || !sameLines(lines, now)) {
      return {
        pass: false,
        message: `This pull request edits a released section of ${CHANGELOG}: "${heading}". A released section is never edited: fix it with a new line under "## [Unreleased]".`,
      };
    }
  }

  const before = new Set(unreleasedOf(base).map((line) => line.trim()));
  const added = unreleasedOf(head).filter((line) => isEntry(line) && !before.has(line.trim()));
  if (added.length > 0) {
    return {
      pass: true,
      message: `${CHANGELOG} has ${String(added.length)} new line(s) under "## [Unreleased]".`,
    };
  }

  const released = [...head.keys()].filter(
    (heading) => !UNRELEASED.test(heading) && !base.has(heading),
  );
  if (released.length > 0) {
    return { pass: true, message: `This pull request cuts a release: ${released.join(", ")}.` };
  }

  for (const message of input.commitMessages) {
    const reason = TRAILER.exec(message)?.[1];
    if (reason !== undefined) {
      return { pass: true, message: `No changelog entry, and a commit says why: ${reason.trim()}` };
    }
  }

  return {
    pass: false,
    message: `This pull request adds no line under "## [Unreleased]" in ${CHANGELOG}, and no commit says why.\n${HOW_TO}`,
  };
};

const git = (...args: string[]): string =>
  execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

/** A file at a commit, or `null` when the commit does not hold it. */
const fileAt = (commit: string, path: string): string | null => {
  try {
    return execFileSync("git", ["show", `${commit}:${path}`], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return null;
  }
};

const main = (): void => {
  const { values } = parseArgs({
    options: { base: { type: "string" }, head: { type: "string", default: "HEAD" } },
  });
  if (values.base === undefined) {
    console.error("Usage: changelog-check.ts --base <ref> [--head <ref>]");
    process.exit(2);
  }
  const start = git("merge-base", values.base, values.head).trim();
  const commitMessages = git("log", "--format=%B%x00", `${start}..${values.head}`)
    .split("\0")
    .map((message) => message.trim())
    .filter((message) => message !== "");
  const result = checkChangelog({
    base: fileAt(start, CHANGELOG),
    head: fileAt(values.head, CHANGELOG),
    commitMessages,
  });
  if (result.pass) {
    console.log(result.message);
    return;
  }
  console.error(result.message);
  process.exit(1);
};

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
