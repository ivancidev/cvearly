<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Developer Verification & Linting Rules

- **Strict TypeScript Types:** Do NOT use the `any` type. Always type interfaces, variables, and parameters properly, or use `unknown` if the shape is truly dynamic.
- **React 19 / Next 16 State Guidelines:** Avoid synchronous `setState` invocations inside `useEffect` bodies during initial mount to prevent cascading renders. Defer them using `setTimeout` or `requestAnimationFrame` if resets are needed.
- **Mandatory Verification:** Whenever any changes are made to source files, you **MUST** run the linter (`npm run lint`) and the build compiler (`npm run build`) to guarantee that all checks and compiles pass cleanly before finishing.

# UI/UX Rules

- **Cursor Pointer on Interactives:** Every `<button>`, `<a>`, and clickable `<span>` / `<div>` MUST include `cursor-pointer` in its className. Never rely on browser defaults for interactive elements. The base Button component already includes this — preserve it.

