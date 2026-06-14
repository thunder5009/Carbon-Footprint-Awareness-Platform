# Contributing to CarbonTrack

We operate with zero-compromise engineering standards. Inconsistent code scales poorly, and untested code is broken code.

## Git Workflow
1. Branch from `main` using the format `feature/<name>`, `bugfix/<name>`, or `refactor/<name>`.
2. Commit frequently using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
3. Push and open a Pull Request against `main`.

### Conventional Commits
- `feat:` A new feature.
- `fix:` A bug fix.
- `docs:` Documentation only changes.
- `test:` Adding missing tests or correcting existing tests.
- `chore:` Maintenance, dependency updates, etc.

*Example:* `feat(calculator): add EV charging energy calculation`

## Testing Mandate (70/20/10)
**No Pull Request will be merged if it drops total coverage below 90% or engine coverage below 100%.**

- **Unit Tests (70%):** All calculation logic must be tested in isolation inside `src/lib/calculations/__tests__`. Use Vitest.
- **Integration Tests (20%):** Any new API routes must have integration tests against the database. Any new UI forms must have React Testing Library form interaction tests.
- **E2E Tests (10%):** Critical user flows must be tested in Playwright.

**To verify your code before pushing:**
```bash
npm run test           # Validates coverage
npm run test:e2e       # Validates critical paths
npm run lint           # Validates ESLint/Prettier formatting
```

## Code Style
- **TypeScript:** Strict mode is enforced. `any` is forbidden unless explicitly required for external library integrations.
- **Styling:** Use Tailwind CSS utility classes. Prefer compound components via `class-variance-authority` (cva) over inline ternary hell.
- **State Management:** Use `sessionStorage` for temporary, anonymous state. Use React Hook Form for form state. Do not introduce Redux/Zustand without a design review.
