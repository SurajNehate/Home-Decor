`
# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.
``

Project type: Angular 19 standalone application with SSR (Express) using @angular/cli.
Package manager: npm (package-lock.json present; angular.json sets packageManager to npm).

Commands you’ll commonly use
- Install dependencies (clean, reproducible):
  - npm ci
  - For local dev if you’re modifying dependencies: npm install
- Start dev server (browser at http://localhost:4200):
  - npm start
  - Equivalent: ng serve
- Build (production, outputs browser and server bundles under dist/home-decor-ng19):
  - npm run build
- Continuous dev build (watch mode):
  - npm run watch
- Run unit tests (Karma + Jasmine):
  - npm test
  - Equivalent: ng test
- Run a single test file:
  - ng test --include src/app/app.component.spec.ts
- Run a single test case:
  - Temporarily change the desired test to fit(...) or fdescribe(...) and run ng test
- Serve the SSR build (after npm run build):
  - npm run serve:ssr:home-decor-ng19
  - Override port (PowerShell): $env:PORT=5000; npm run serve:ssr:home-decor-ng19

Notes on tooling
- Linting: No ESLint configuration or lint script detected in this repo.
- E2E: README mentions ng e2e, but no e2e framework is configured by default.

High-level architecture and structure
- Framework and bootstrap
  - Standalone app (no NgModules). Client bootstrap in src/main.ts via bootstrapApplication(AppComponent, appConfig).
  - Hydration enabled with event replay: provideClientHydration(withEventReplay()) in src/app/app.config.ts.
- Routing
  - Defined in src/app/app.routes.ts as lazy-loaded standalone components:
    - '' (home)
    - 'catalog' and 'catalog/:id' (product list/detail)
    - 'cart'
    - 'checkout-guest'
    - 'contact-us'
    - 'admin-login'
    - 'admin/catalog'
    - Wildcard redirects to ''
- SSR pipeline
  - Builder: @angular-devkit/build-angular:application with outputMode: 'server'. Server entry at src/server.ts; server main at src/main.server.ts.
  - src/server.ts sets up an Express app, serves static assets from the browser bundle, and uses AngularNodeAppEngine to handle requests. It exports reqHandler for CLI/dev-server integration and starts an Express server when run directly.
  - Prerender configuration via src/app/app.routes.server.ts with RenderMode.Prerender for '**', wired in src/app/app.config.server.ts using provideServerRouting.
  - Production build emits dist/home-decor-ng19/{browser,server}. The server is launched with npm run serve:ssr:home-decor-ng19 (runs dist/home-decor-ng19/server/server.mjs).
- Data and state
  - CatalogService (src/app/shared/services/catalog.service.ts):
    - Loads products from src/assets/products.json into a BehaviorSubject, exposing streams for all() and byId(...).
    - Provides add/update/remove operations in-memory (client-side only). Includes utilities to download current list as JSON and import from JSON text.
  - CartService (src/app/shared/services/cart.service.ts):
    - Client-only persistence using localStorage (key guest_cart_v1). Provides add/updateQty/remove/clear plus total() and count().
- TypeScript configuration
  - Strict TS settings, moduleResolution: 'bundler', target/module: ES2022 (tsconfig.json).
  - Separate configs for app (tsconfig.app.json) and specs (tsconfig.spec.json).
- Testing
  - Configured via angular.json using the Karma builder with Jasmine. Default spec example at src/app/app.component.spec.ts.

Key references
- angular.json: project build/serve/test configuration, SSR settings (outputMode: server, server entry).
- src/server.ts: Express server integration for SSR.
- src/app/app.config.ts and app.config.server.ts: client and server providers/hydration/prerender routing.
- src/app/shared/services/*: core client-side data/services for catalog and cart.
- README.md: Basic dev, build, and test instructions (Angular CLI 19.1.8).