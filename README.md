

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Running the storefront locally

1. Install dependencies: `npm install`.
2. Copy `.env.example` to `.env.local` and fill in your WooCommerce credentials:
   - `VITE_WOO_CONSUMER_KEY` and `VITE_WOO_CONSUMER_SECRET` come from **WooCommerce → Settings → Advanced → REST API**.
   - Leave `VITE_WOO_API_URL` as `/wp-json/wc/v3` to reuse the built-in dev proxy to `https://zvukovaakademia.sk`.
   - Set `VITE_PROJECT_URL` to the base URL of the WordPress site (for example `https://zvukovaakademia.sk/`).
3. Start the Vite dev server: `npm run dev -- --host --port 8080` (the config already targets port **8080**).
4. Open [http://localhost:8080/products](http://localhost:8080/products). If products do not load, double-check the consumer key/secret values and that the WordPress site is reachable (the dev proxy forwards all `/wp-json/**` calls to `https://zvukovaakademia.sk`).


