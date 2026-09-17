# AGENTS.md

## Build Commands
- `npm run dev` - Start dev server (port 8080)
- `npm run dev2` - Alternative dev mode
- `npm run build` - Production build
- `npm run build:dev` - Development build
- `npm run build:stage` - Staging build
- `npm run preview` - Preview build
- **No test framework configured**

## Code Style Guidelines

### Imports & Formatting
- Use ES6 imports with `@` for src, `~` for root
- Add single-line comment above 3rd-party imports (e.g., `// Axios (HTTP请求库)`)
- 2-space indentation, semicolons, single quotes
- No lint tools configured

### Types & Naming
- TypeScript: `strict: false`, avoid `as any`/`@ts-ignore`
- **JSDoc required for ALL custom functions**: include description, params (type+desc), return (type+desc), exceptions
- Variables/functions: camelCase, Components: PascalCase, Constants: UPPER_SNAKE_CASE
- Vue props: add type comments in `<script-setup>`

### Error Handling
- **Components**: async/await + try-catch mandatory
- **API modules** (`src/api/**`): no try-catch; let errors propagate to callers
- **Global axios interceptor** (`src/utils/request.js`) is the single source of truth for API error toasts:
  - HTTP errors (4xx/5xx, network, timeout): shown via `ElMessage` in the error interceptor
  - Business errors (HTTP 200 but `code !== 200`): shown via `ElMessage` / `ElNotification` in the response interceptor, then `Promise.reject(...)`
- **Do NOT duplicate error toasts in components** when calling APIs wrapped by `request`:
  - `Promise.reject(...)` from the interceptor causes `await` to throw → execution jumps to `catch`, **not** an `else` branch after `await`
  - Therefore `else { ElMessage.error(...) }` after `if (res.code === 200)` is usually dead code and should be avoided
  - In `catch`, log or run cleanup only; do not call `ElMessage.error` again unless the error is local (form validation, non-axios logic)
- **Components should still handle**:
  - Success messages (`ElMessage.success`)
  - Loading / submitting state (`finally`)
  - Local validation errors
  - Post-error UI behavior (keep dialog open, reset form, etc.)
- Optional reference: `src/utils/errorHandler.js` for non-request errors
- **`errorHandler.js` unhandledrejection**: axios/request errors are logged only (no toast); `request.js` interceptor already notified the user

### Comments & Patterns
- Magic numbers/regex need inline comments
- Class overviews + private method docs
- Vue 3 Composition API preferred
- Single responsibility principle
- **From Cursor rules**: All outputs in Chinese, no git operations
- **Amount Fields**: All amount-related form items must use 4 decimal places of precision.
