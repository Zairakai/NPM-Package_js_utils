# Contributing

> This project follows the [Zairakai Global Contributing Guide][handbook-contributing].  
> Please read it before contributing. The sections below document project-specific workflow.

---

## Development Workflow

| Step | Command / Action | Description |
| :------------- | :--------------------------------------------- | :-------------------------------------------------- |
| **1. Install** | `npm install` | Install dependencies and set up git hooks. |
| **2. Branch** | `git checkout -b feature/#TICKET-name` | Create a feature branch from `main`. |
| **3. Code** | _(your IDE)_ | Implement your changes following quality standards. |
| **4. Quality** | `make quality` | Run the full quality gate. |
| **5. Test** | `make test-all` | Ensure all tests (Vitest + BATS) are passing. |
| **6. Commit** | `git commit -m "type(scope): #TICKET subject"` | Use [Conventional Commits][git-rules] format. |
| **7. Push** | `git push origin feature/#TICKET-name` | Push and open a Merge Request to `main`. |

---

## Types of Contributions

| Type | Guidelines |
| :---------------------------- | :-------------------------------------------------------------------------------------------------------- |
| **🐛 Bug Reports** | Use the issue template. Include minimal reproduction steps, expected vs actual behavior, Node.js version. |
| **✨ Feature Requests** | Describe the use case. Must fit the scope (utility functions, Laravel-style helpers, TypeScript). |
| **🔤 String Helpers** | In `src/str.ts`. Use camelCase. No `any`. Add JSDoc. Maintain backward compatibility. |
| **🔢 Number / Array Helpers** | In `src/number.ts` or `src/arrays.ts`. Cover edge cases (empty, NaN, null) in Vitest tests. |
| **✅ Validation / Format** | In `src/validators.ts` or `src/formatters.ts`. Zero external dependencies unless justified. |
| **📦 Types & Exports** | Keep `src/index.ts` exports stable. Breaking changes require major version bump. |

---

## Quality Targets

| Command | Tool | Description |
| :------------------ | :----------- | :-------------------------------------------------- |
| `make quality` | All | Full quality gate (lint, format, typecheck, tests). |
| `make eslint` | ESLint | JavaScript/TypeScript linting. |
| `make prettier` | Prettier | Code formatting check. |
| `make test` | Vitest | Run unit tests with coverage. |
| `make bats` | BATS | Run shell script integration tests. |
| `make markdownlint` | Markdownlint | Validate Markdown documentation. |

---

[handbook-contributing]: https://gitlab.com/zairakai/handbook/-/blob/main/CONTRIBUTING.md
[git-rules]: https://gitlab.com/zairakai/handbook/-/blob/main/policies/git-rules.md
