# Contributing to CVEarly

Thank you for your interest in contributing! CVEarly is an open source project and all contributions are welcome — bug fixes, features, documentation improvements, and design feedback.

---

## Getting Started

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/cvearly.git
cd cvearly
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is needed to resolve React 19 peer dependency conflicts.

### 3. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and add your API key:

```env
GEMINI_API_KEY=AIzaSy...your_key_here
```

Get a free key at [Google AI Studio](https://aistudio.google.com/).

### 4. Start the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Development Workflow

### Branching

- `main` — stable, production-ready code
- Feature branches: `feat/your-feature-name`
- Bug fix branches: `fix/your-bug-description`

### Making Changes

1. Create your branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Make your changes
3. Verify all checks pass locally:
   ```bash
   npm run lint        # ESLint
   npm run type-check  # TypeScript
   npm run build       # Production build
   ```
4. Commit with a descriptive message:
   ```bash
   git commit -m "feat: add GitHub username auto-suggest"
   ```
5. Push and open a Pull Request against `main`

---

## Code Standards

- **TypeScript:** No `any` types. Use proper interfaces or `unknown`.
- **Components:** Keep them focused and reusable. Follow the existing structure under `components/`.
- **Styling:** Tailwind CSS v4 utility classes only. No inline styles.
- **Cursor:** All interactive elements (`button`, `a`, clickable `div`/`span`) must have `cursor-pointer`.
- **Commits:** Use [Conventional Commits](https://www.conventionalcommits.org/) format (`feat:`, `fix:`, `docs:`, `chore:`, etc.)

---

## Reporting Bugs

Use the [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md) issue template. Please include reproduction steps and your environment details.

## Suggesting Features

Use the [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md) template. Explain the problem you're solving, not just the solution.

---

## License

By contributing to CVEarly, you agree that your contributions will be licensed under the [MIT License](LICENSE).
