---
description: Generate README, init git, and commit the project with a meaningful message. Pass the repo URL as argument or get prompted.
---

You are running the `jaber-git-commit` command.

1. If `$1` is provided, use it as the repo URL. Otherwise, ask me for the GitHub repository URL.
2. Read the full project structure and code to understand the project thoroughly.
3. Write or update `README.md` at the project root. It must be a genuine, hand-crafted README — no AI-sounding fluff, no marketing buzzwords. Write like a real developer wrote it for other developers. Include:
   - Project name and one-line what it does
   - Table of contents
   - Tech stack (Next.js 16, Express 5, MongoDB, Tailwind v4, daisyUI v5, Groq AI)
   - Project structure overview
   - Getting started (prerequisites, clone, install, environment variables, run)
   - Available scripts (both frontend and backend)
   - API overview
   - Architecture notes (auth via BetterAuth, backend proxy pattern, Groq AI)
   - Deployment notes
4. Initialize git if `.git` does not exist: `git init`
5. Stage all files: `git add -A`
6. Generate a meaningful commit message based on the project state and commit.

Always use `git add -A`, never partial staging.
