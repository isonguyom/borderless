# Borderless

**Year:** 2025  
**Mission:** Build a frontend-first, multi-currency cross-border payment dashboard.

---

## Overview

**Borderless** is a simulation of a cross-border payment system designed to make complex financial flows simple, reliable, and user-friendly.  
The app allows users to:

- Onboard & create wallets (mock API with email/phone only).  
- Deposit funds into supported stablecoins (mock API).  
- Swap currencies using live FX API data (with graceful failure handling).  
- Send funds cross-border to another wallet (mock API).  
- View balances, transaction history, and FX analytics (tables + charts).  

This project prioritizes **frontend-first development**, with a focus on UX, state management, and scalability.

---


## Features

1. **Wallet Management**
   - Create wallets in multiple currencies (USD, NGN, EUR, GBP, USDT, USDC, BUSD, DAI).  
   - Deposit funds and view wallet balances.  

2. **Currency Swap**
   - Real-time FX rates integration.  
   - Error handling with fallback messages if API fails.  

3. **Cross-Border Transfers**
   - Send funds between wallets.  
   - Track transaction history and analytics.  

4. **Notifications & Preferences**
   - Manage notification settings (email, push, in-app).  
   - Dark/light mode support.  

5. **Analytics**
   - Charts for FX analytics and a table showing currencies' performance.  

---


## Project Setup

**Clone the repository**

```bash
[git clone https://github.com/yourusername/operation-borderless.git](https://github.com/isonguyom/borderless.git)
cd borderless
```

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Run mock API json-server

```sh
npx json-server --watch db.json --port 4000
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
