# client-scripting-fe

React single-page application for browsing and managing customers, bills, and bill items.
Course project for **Advanced Client Scripting** (NKS).

The frontend talks to the supplied Node.js / JSON Server mock REST API; no backend code is
part of this repository.

## Requirements

- Node.js 20+
- The course backend (`NKS_Backend.zip`, extracted next to this folder as `back-end/`)

## Running

Start the backend first, in the `back-end` folder:

```bash
npm ci
npm run start-auth
```

It listens on `http://localhost:3000`.

Then start the frontend, in this folder:

```bash
npm install
npm run dev
```

Vite serves the app on `http://localhost:5173`.

## Backend notes

- Login: `POST /auth/login` with `{"email":"admin@email.com","password":"123qweasd"}` returns
  `{ "access_token": "<JWT>" }`. Send it as `Authorization: Bearer <JWT>`.
- Public reads: `GET /Customer`, `GET /City`.
- Everything else (all writes, and reads of `/Bill`, `/Item`, `/Product`, `/Seller`,
  `/CreditCard`) requires the token. Tokens expire after 1 hour.
- Data lives in memory — restarting the server restores the original sample data.

## Third-party libraries

| Library | Used for |
| --- | --- |
| react-router-dom | Routed multi-view navigation |
| axios | REST calls and auth-token handling |
| bootstrap | Responsive layout and styling |
| prop-types | Component prop validation |
