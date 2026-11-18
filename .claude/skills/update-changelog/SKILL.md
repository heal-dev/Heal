---
name: update-changelog
description: Add or fix the CHANGELOG.md entry for the change on the current branch. Use it before you open or update a pull request, when a change is one a user of Heal would see, or when asked to update the changelog.
---

# Update the changelog

`CHANGELOG.md` follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). A pull request adds its lines under `## [Unreleased]`. This skill writes those lines from the real diff, not from memory of the work.

## 1. Read what changed

```sh
git fetch origin main --quiet
git log --oneline origin/main..HEAD
git diff --stat origin/main...HEAD
git diff origin/main...HEAD -- . ':!package-lock.json'
```

Read the diff itself. A commit title says what the author meant; the diff says what is true.

## 2. Decide if a user would see it

A user is a person or a coding agent that installs and runs Heal.

- **Write an entry** when the change adds, changes, removes or fixes something they can observe: a command, an option, an output, a file Heal writes, an error message, a requirement (Node version, a dependency they must have).
- **Write no entry** for a change they cannot observe: refactoring, tests, CI, lint rules, internal docs, dependency bumps with no effect on behaviour.

If there is nothing to write, do not add a line to look complete. Say so in a commit message, with a trailer, and the check passes:

```
No-Changelog: <the reason, in a few words>
```

## 3. Pick the section

| Section        | For                                         |
| -------------- | ------------------------------------------- |
| **Breaking**   | a change that makes an existing use fail    |
| **Added**      | something new                               |
| **Changed**    | something that works differently            |
| **Deprecated** | something that still works and will go away |
| **Removed**    | something that is gone                      |
| **Fixed**      | a bug that is gone                          |
| **Security**   | a vulnerability that is closed              |

Under `## [Unreleased]`, keep the sections in this order, and create a section only when it has a line. "Breaking" comes first so nobody misses it.

## 4. Write the line

- One line per change a user would see, not one line per commit.
- A full sentence about what is now true, from the user's side. "The check command lists what is left to test in production", not "add still-to-test list".
- Name the command, option or file the user will meet, in backticks.
- For a breaking change, say what to do: the old way, then the new way.
- If the branch already has an entry for this change, edit that line. Do not add a second one.
- End the line with the pull request number when it exists: `(#12)`.

## 5. Check

```sh
npx prettier --write CHANGELOG.md
git diff CHANGELOG.md
npm run check:changelog
```

The diff must touch only lines under `## [Unreleased]`. `npm run check:changelog` is the check CI runs on every pull request: it must pass.

## Rules

- Never edit a released section (a heading with a version number). A mistake there is fixed by a new line under `[Unreleased]`.
- Never invent a change. Every line must point to something in the diff.
- Do not cut a release (rename `[Unreleased]` to a version, add a date, tag) unless a maintainer asks for it.
