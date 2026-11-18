# Guidance for coding agents

This file is the project guidance for every coding agent. It is short on purpose: it holds judgment, not reference. For facts, read the source named in "Find current facts".

## What Heal is

Heal builds the verification harness a repo is missing: the tools a coding agent needs to see for itself whether its change works, before production, while the product runs, and after production.

Heal does not rebuild what an existing tool plus CI already does (linters, type checks, unit test runners).

## Engineering taste

- Build the smallest thing that is true. No option, layer or abstraction without a present need.
- A claim is checked where it is made. Never accept "it works" from a worker, a test name or a comment: run it and read the result.
- A check says what it proves and what it cannot prove.
- Rules that a machine can check live in code, types, lint or CI. Do not write them as prose here.
- Fail clearly: an error names what is wrong and what to do next.

## Architecture

Source code has four layers: `domain`, `application`, `infrastructure`, `bootstrap`. Dependencies point to the domain only. A port lives in the domain; an adapter lives in the infrastructure and is named after its technology. Entry points and wiring live in `bootstrap`. Tests live in `tests/` and mirror `src/`.

## Before you push

Run these, and fix what they report:

```sh
npm run check
npm test
npm run build
```

CI runs the same commands. Do not weaken a check, a lint rule or a test to make it pass.

## Git safety

- Never force-push, never rewrite `main`.
- Never run `git clean -fd` or `git reset --hard` on work you did not create.
- A commit title is a sentence about what is now true.
- Do not commit secrets or `.env` files.

## Find current facts

| For                                   | Read                       |
| ------------------------------------- | -------------------------- |
| What the project is                   | `README.md`                |
| Commands                              | `package.json` (`scripts`) |
| Lint rules                            | `eslint.config.js`         |
| Compiler rules                        | `tsconfig.json`            |
| What CI runs                          | `.github/workflows/ci.yml` |
| How to contribute, commit conventions | `CONTRIBUTING.md`          |
| What changed                          | `CHANGELOG.md`             |
| Security reports                      | `SECURITY.md`              |
