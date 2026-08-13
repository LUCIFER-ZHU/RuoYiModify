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
- **API interfaces**: no try-catch
- Central error handler: `src/utils/errorHandler.js`
- Use ElMessage/ElNotification for errors

### Comments & Patterns
- Magic numbers/regex need inline comments
- Class overviews + private method docs
- Vue 3 Composition API preferred
- Single responsibility principle
- **From Cursor rules**: All outputs in Chinese, no git operations
- **Amount Fields**: All amount-related form items must use 4 decimal places of precision.
