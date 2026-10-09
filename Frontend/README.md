# Sabeel frontend

React/Vite rider and captain client for Sabeel.

## Setup

Copy `.env.example` to `.env` and configure:

- `VITE_BASE_URL`: Backend API/Socket.IO URL; defaults to `http://localhost:3000`.
- `VITE_MAPBOX_TOKEN`: Public Mapbox token with Geocoding and Directions access.

`VITE_*` values are exposed in the browser bundle. Use only a public, restricted
Mapbox token here; never put backend secrets in frontend variables. Restart the
Vite development server after changing environment variables.

From this directory, install dependencies and start the development server:

```powershell
npm install
npm run dev
```

Build and lint:

```powershell
npm run build
npm run lint
```

The backend and MongoDB must be running for authentication, fare quotes, ride
requests, driver offers, and live ride updates. See the [project setup](../README.md)
and [backend API guide](../Backend/README.md).
