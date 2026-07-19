---
description: Commit and push to GitHub. Auto-detects if git is initialized. Pass repo URL as $1 for first-time setup.
---

You are running the `jaber-git-commit` command.

If `.git` already exists (git initialized):
  1. Read `git status --short`. If nothing to commit, tell the user and stop.
  2. Compare the current README.md against the actual project files. Look for:
     - Missing API endpoints, routes, or features that exist in code but aren't documented
     - Outdated or incorrect info (wrong scripts, wrong tech versions, stale structure)
     - Sections that should be added, removed, or updated based on what changed
  3. Update README.md accordingly — add what's missing, fix what's wrong, remove what's gone.
  4. Stage all files: `git add -A`
  5. Read `git diff --cached --stat` to understand what changed.
  6. Generate a meaningful commit message and commit.
  7. Push: `git push`

If `.git` does NOT exist (first-time setup):
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
  4. `git init`
  5. Stage all files: `git add -A`
  6. Generate a meaningful commit message and commit.
  7. `git remote add origin <repo-url>`
  8. `git push -u origin master`

Always use `git add -A`, never partial staging.
