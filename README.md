# Eddie Kanevsky — Portfolio

Personal portfolio and blog built on [Mizuki](https://github.com/matsuzaka-yuki/Mizuki), powered by Astro 5, Svelte 5, and Tailwind CSS.

## Stack

- **Framework:** [Astro 5](https://astro.build) (static output)
- **UI:** [Svelte 5](https://svelte.dev) + [Tailwind CSS 3](https://tailwindcss.com)
- **Search:** [Pagefind](https://pagefind.app)
- **Language:** TypeScript
- **Runtime:** Node >= 24, pnpm

## Getting Started

```bash
pnpm install
pnpm dev          # localhost:4321
pnpm build        # production build
```

## Project Structure

```
src/
├── config.ts          # Central site configuration
├── content/posts/     # Blog posts (Markdown)
├── content/spec/      # Special pages (about, friends)
├── data/              # Structured data (projects, skills, timeline, anime)
├── components/        # Astro + Svelte components
├── plugins/           # Custom remark/rehype plugins
└── scripts/           # Build & data-fetching scripts
```

Content (posts, images, data files) lives in a separate private repo and is synced automatically via the `ENABLE_CONTENT_SYNC` env var during dev/build hooks.

## Branch Strategy

| Branch   | Purpose                                |
|----------|----------------------------------------|
| `master` | Tracks upstream Mizuki for updates     |
| `site`   | Personal customizations and content    |

## Upstream

Forked from [Mizuki](https://github.com/matsuzaka-yuki/Mizuki) (Apache-2.0), itself based on [Fuwari](https://github.com/saicaca/fuwari) (MIT).

## License

[Apache-2.0](LICENSE)
