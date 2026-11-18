# Contributing

Heal is at its very start. Issues and ideas are welcome. Please open an issue before a large pull request, so we agree on the outcome first.

## Set up

You need Node 22 or later (`.nvmrc` has the version CI uses).

```sh
npm install
```

## Check your change

```sh
npm run check   # types, lint, format
npm test        # unit tests
npm run build   # the build
```

CI runs the same commands. A pull request merges when the `ci-gate` check is green and a maintainer approved it.

A pre-commit hook formats and lints the files you staged. `npm run lint:fix` and `npm run format` fix most findings.

## Commits and pull requests

- A commit title is a sentence about what is now true. For example: "The check command refuses a card with no limits", not "fix check".
- One concern per pull request.
- Commits on `main` must be signed.
- Fill the pull request template. The "Validation" and "Not verified" sections matter most: say what you ran, and what you did not check.
- Every pull request adds a line under `[Unreleased]` in `CHANGELOG.md`, or says why not with a commit trailer: `No-Changelog: <reason>`. CI checks it (`npm run check:changelog`). A coding agent can do it with the `update-changelog` skill (`.claude/skills/update-changelog/SKILL.md`).

## Source files

Every source file starts with the copyright header. `npm run lint:fix` adds it.

## Security

See [SECURITY.md](SECURITY.md). Do not report a vulnerability in a public issue.

## Licence

Heal is under the [MIT licence](LICENSE). By contributing, you agree that your contribution is under the same licence.
