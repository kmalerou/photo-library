# Photo Gallery

A photo browsing app built with Angular 22: an infinite-scrolling photostream, click-to-favorite, a Favorites library that persists across reloads, and a full-screen photo detail view.

## Features

- **Photostream** (`/`) — infinite-scrolling grid of random photos ([Picsum](https://picsum.photos))
- **Favoriting** — click any photo to favorite it; favorites persist in `localStorage`
- **Favorites library** (`/favorites`) — browse everything you've favorited
- **Photo detail** (`/photos/:id`) — full-screen view of a favorited photo, with a remove action

## Tech Stack

- Angular 22
- Angular Material 22
- NgRx 21
- SCSS
- Vitest

## Getting Started

```bash
npm install
npm start
```

Runs at `http://localhost:4200`.

> NgRx 21's published peer range doesn't cover Angular 22 yet — `package.json` scopes an `overrides` entry to just the three NgRx packages instead of disabling peer-dependency checks project-wide. The NgRx team has confirmed NgRx v21 works with Angular v22 in the interim before a v22 release ([ngrx/platform#5158](https://github.com/ngrx/platform/issues/5158)); they suggest `npm i --legacy-peer-deps` as the workaround, and the scoped `overrides` here achieve the same result without disabling peer-dependency checks for the whole project.

## Scripts

| Command                 | Description                                    |
| ------------------------ | ----------------------------------------------- |
| `npm start`              | Run the dev server                              |
| `npm run build`          | Production build (`dist/`)                      |
| `npm test`                | Run unit tests                                  |
| `npm run test:coverage`  | Run tests with a coverage report (gated at 75%)  |
| `npm run lint`            | Lint the codebase                               |
| `npm run format`          | Format with Prettier                            |
| `npm run format:check`    | Check formatting without writing changes         |
| `git push`                | Runs `format:check`, `lint`, and `test:coverage` automatically via a Husky pre-push hook |

## Project Structure

```
src/
├── app/
│   ├── core/       # app-wide singletons: API service, snackbar, header
│   ├── shared/     # reusable UI wrappers and models
│   └── features/   # one folder per route, each with its own NgRx slice
└── environments/   # per-configuration environment files
```
