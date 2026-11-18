/**
 * Copyright (c) 2026 Myia. Licensed under the MIT License.
 */
import { describe, expect, it } from "vitest";
import { checkChangelog } from "../../scripts/changelog-check.ts";

const changelog = (unreleased: string[], released = ["- The first release."]): string =>
  [
    "# Changelog",
    "",
    "## [Unreleased]",
    "",
    ...unreleased,
    "",
    "## [0.1.0] - 2026-11-01",
    "",
    "### Added",
    "",
    ...released,
    "",
  ].join("\n");

const BASE = changelog(["### Added", "", "- The `check` command."]);

describe("checkChangelog", () => {
  it("passes when a line is added under Unreleased", () => {
    const head = changelog(["### Added", "", "- The `check` command.", "- The `judge` command."]);
    expect(checkChangelog({ base: BASE, head, commitMessages: ["Add judge"] }).pass).toBe(true);
  });

  it("passes on a new changelog that has an entry", () => {
    expect(checkChangelog({ base: null, head: BASE, commitMessages: [] }).pass).toBe(true);
  });

  it("fails when nothing is added and no commit says why", () => {
    const result = checkChangelog({
      base: BASE,
      head: BASE,
      commitMessages: ["Refactor the loader"],
    });
    expect(result.pass).toBe(false);
    expect(result.message).toContain("No-Changelog: <reason>");
  });

  it("does not count a new heading or a blank line as an entry", () => {
    const head = changelog(["### Added", "", "- The `check` command.", "", "### Fixed", ""]);
    expect(checkChangelog({ base: BASE, head, commitMessages: [] }).pass).toBe(false);
  });

  it("passes with the No-Changelog trailer, and reports the reason", () => {
    const result = checkChangelog({
      base: BASE,
      head: BASE,
      commitMessages: [
        "Refactor the loader\n\nNo-Changelog: internal refactoring, no behaviour change",
      ],
    });
    expect(result.pass).toBe(true);
    expect(result.message).toContain("internal refactoring");
  });

  it("fails on a trailer with no reason", () => {
    expect(
      checkChangelog({ base: BASE, head: BASE, commitMessages: ["Refactor\n\nNo-Changelog:"] })
        .pass,
    ).toBe(false);
  });

  it("fails when a released section is edited, even with a new entry", () => {
    const head = changelog(
      ["### Added", "", "- The `check` command.", "- More."],
      ["- The first release, reworded."],
    );
    const result = checkChangelog({ base: BASE, head, commitMessages: [] });
    expect(result.pass).toBe(false);
    expect(result.message).toContain("[0.1.0]");
  });

  it("fails when a released section is removed", () => {
    const head = ["# Changelog", "", "## [Unreleased]", "", "- New."].join("\n");
    expect(checkChangelog({ base: BASE, head, commitMessages: [] }).pass).toBe(false);
  });

  it("passes when the pull request cuts a release", () => {
    const head = [
      "# Changelog",
      "",
      "## [Unreleased]",
      "",
      "## [0.2.0] - 2026-12-01",
      "",
      "### Added",
      "",
      "- The `check` command.",
      "",
      "## [0.1.0] - 2026-11-01",
      "",
      "### Added",
      "",
      "- The first release.",
      "",
    ].join("\n");
    expect(checkChangelog({ base: BASE, head, commitMessages: [] }).pass).toBe(true);
  });

  it("fails when the changelog is deleted", () => {
    expect(checkChangelog({ base: BASE, head: null, commitMessages: [] }).pass).toBe(false);
  });
});
