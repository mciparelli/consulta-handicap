# Consulta de Handicap

A golf handicap lookup application built with Elysia and JSX server-side rendering, deployed to Cloudflare Workers.

## Tech Stack

- **[Elysia](https://elysiajs.com/)** - Fast Bun web framework
- **[@kitajs/html](https://github.com/kitajs/html)** - JSX runtime for server-side rendering
- **[Datastar](https://data-star.dev/)** - Lightweight hypermedia framework for client-side interactivity
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Cloudflare Workers](https://workers.cloudflare.com/)** - Edge deployment
- **[Turso/libSQL](https://turso.tech/)** - Edge SQLite database

## Features

- Search for players by name or matricula (registration number)
- View player's last 20 score cards (tarjetas)
- See handicap history and trends
- Highlights the 8 best differentials used for handicap calculation
- Shows unprocessed cards that will be included next Thursday

## Development

### Prerequisites

- [Bun](https://bun.sh/) installed
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) for Cloudflare Workers

### Setup

1. Install dependencies:

   ```bash
   bun install
   ```

2. Build CSS:

   ```bash
   bun run build:css
   ```

3. Start development server:

   ```bash
   bun run dev
   ```

### Project Structure

```
src/
├── index.tsx          # Main Elysia app with routes
├── types.ts           # TypeScript type definitions
├── utils.ts           # Utility functions
├── api/
│   ├── index.ts       # API exports
│   ├── aag.ts         # AAG (Argentine Golf Association) API
│   ├── vista.ts       # Vista Golf API for player search
│   └── hyperdrive-db.ts  # Database operations
├── db/
│   └── pg-client.ts   # PostgreSQL client for Hyperdrive
├── pages/
│   ├── layout.tsx     # Main layout with header and player search
│   ├── home.tsx       # Home page
│   ├── tarjetas.tsx   # Score cards page
│   └── setup-db.tsx   # Database setup page
└── components/
    └── player-results.tsx  # Player search results dropdown
```

## Deployment

### Configure Wrangler

Set your secrets:

```bash
# Set your Turso database URL
wrangler secret put LIBSQL_URL
# Enter: libsql://your-database.turso.io

# Set your Turso auth token
wrangler secret put LIBSQL_AUTH_TOKEN
# Enter: your-auth-token
```

### Deploy

```bash
bun run deploy
```

## Database Setup

1. Create a Turso database at [turso.tech](https://turso.tech)
2. Get your database URL and auth token
3. Configure the secrets in Cloudflare (see above)
4. Navigate to `/setup-db` to initialize the schema

## Client-Side Interactivity

This app uses [Datastar](https://data-star.dev/) for client-side interactivity instead of React. Datastar provides:

- `data-store` - Reactive state management
- `data-bind` - Two-way data binding
- `data-on` - Event handlers with debouncing
- `data-show` - Conditional rendering
- `@get()` - Fetch and morph HTML from server

Example from the player search:

```html
<input
  data-bind:value="$searchString"
  data-on:input.debounce_250ms="$searchString.length >= 3 && @get('/api/find-players?searchString=' + $searchString)"
/>
```

## License

MIT