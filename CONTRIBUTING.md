# Contributing

Thanks for your interest in contributing to this project!

Here are a couple of guidelines to keep in mind before opening a Pull Request:

- Please open a GitHub issue for discussion _before_ submitting any significant changes to this API (including new features or functionality).
- Please don't submit code that has been written by code-generation tools such as Copilot or Claude. (There's nothing wrong with these tools, but I'd prefer them not be a part of this project.)

## Local development

To get started:

```sh
pnpm install
```

### Running the documentation site locally

The documentation site is a great place to test pending changes. It runs on localhost port 3000 and can be started by running:

```sh
pnpm dev
```

### Running tests locally

To run unit tests locally:

```sh
pnpm test
```

### Updating assets

Before subtmitting, also make sure to update generated docs/examples:

```
pnpm compile
pnpm prettier
pnpm lint
```

> [!NOTE]
> If you forget this step, CI will remind you!
