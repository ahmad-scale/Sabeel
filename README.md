# Sabeel — On-Demand Ride-Hailing Platform

Sabeel is a full-stack ride-hailing prototype with separate rider and captain
experiences. Riders can search for places, view an estimated route and fare,
and request a ride. Nearby online captains with a matching vehicle receive the
offer and can accept it, verify the rider's code, start the trip, and mark it
complete.

## Features

- Rider and captain registration, login, protected pages, and logout.
- Mapbox location suggestions with place, region, and country details.
- Driving route display with estimated distance and duration.
- Vehicle fare estimates for car, bike, and rickshaw.
- Server-side same-country/same-state (or region) trip validation.
- Persistent ride requests and status transitions: requested, accepted,
  ongoing, completed, or cancelled.
- Nearby captain offers based on current browser location and vehicle type.
- One-time ride verification code before a captain can start a trip.
- Socket.IO ride-status and captain-location updates.
- Active ride restoration after a page refresh.
- Captain completed-trip earnings, count, and distance statistics.

## Requirements

- Node.js 20.19+ or 22.12+.
- MongoDB, local or hosted.
- A Mapbox public access token with Geocoding and Directions access.

## Local setup

1. Configure the backend:

   ```powershell
   Copy-Item Backend/.env.example Backend/.env
   ```

   Set `DB_CONNECT` to a working MongoDB URI and replace `JWT_SECRET` with a
   strong random value. The default backend port is `3000`.

2. Configure the frontend:

   ```powershell
   Copy-Item Frontend/.env.example Frontend/.env
   ```

   Set `VITE_MAPBOX_TOKEN` to your Mapbox **public** token. This token is
   bundled into the browser application; restrict it in Mapbox and never put a
   secret/private token in a `VITE_*` variable. `VITE_BASE_URL` defaults to
   `http://localhost:3000`.

3. Install and start the backend in one terminal:

   ```powershell
   Set-Location Backend
   npm install
   npm run server
   ```

   The backend waits for MongoDB before listening. The API and Socket.IO server
   use the port in `PORT` (default `3000`).

4. Install and start the frontend in another terminal:

   ```powershell
   Set-Location Frontend
   npm install
   npm run dev
   ```

   Open the local URL printed by Vite, normally `http://localhost:5173`.

After changing frontend environment values, restart Vite. The root `.gitignore`
excludes `.env` files; commit only the `.env.example` templates, never local
credentials.

## Typical ride flow

1. Register or sign in as a rider.
2. Choose a pickup and destination from the suggestions. Both must resolve to
   the same state/region in the same country.
3. Review the route estimate and vehicle fares, then request a ride.
4. Sign in as a captain in a separate browser/session, allow location access,
   and keep the captain home page open to receive matching nearby offers.
5. The captain accepts the offer. The rider shares the displayed six-digit
   verification code; the captain enters it to start the ride.
6. The captain marks the ride complete at the destination.

Captain availability and ride offers require an authenticated Socket.IO
connection and browser location permission. Offers are matched within a
2-kilometer straight-line radius and by vehicle type.

## Ride API

All endpoints are served by the backend. Rider/captain routes require the
corresponding authentication token, sent as a bearer token or token cookie;
`/rides/active` and `/rides/:rideId` accept either role but only return rides
belonging to that identity.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/rides/fare?distanceMeters=...&durationSeconds=...` | Quote fares for each vehicle type. |
| `POST` | `/rides` | Create a rider request with locations, vehicle, distance, and duration. |
| `GET` | `/rides/active` | Restore the caller's current ride. |
| `GET` | `/rides/:rideId` | Retrieve a ride belonging to the caller. |
| `POST` | `/rides/:rideId/accept` | Captain accepts a matching requested ride. |
| `POST` | `/rides/:rideId/start` | Captain starts an accepted ride with `{ "otp": "123456" }`. |
| `POST` | `/rides/:rideId/complete` | Captain completes an ongoing ride. |
| `POST` | `/rides/:rideId/cancel` | Rider cancels a ride before acceptance. |
| `GET` | `/rides/captain/stats` | Captain completed-trip earnings, count, and distance. |

See [Backend API documentation](./Backend/README.md) for authentication
endpoints and response details.

## Checks

```powershell
Set-Location Backend
npm test

Set-Location ../Frontend
npm run lint
npm run build
```

Ride service unit tests cover fare calculations, input bounds, and state/country
restrictions. End-to-end ride testing still requires MongoDB, a valid Mapbox
token, and rider/captain sessions. Frontend lint currently reports legacy
unused-variable/Fast Refresh issues in captain signup, loader/context, and the
unused waiting-for-driver component; the changed ride-flow files pass targeted
lint.

## Prototype limitations

- There is no payment gateway; payment is handled outside the application.
- Fare calculation currently trusts route distance/duration submitted by the
  browser. A production service should calculate or verify routes server-side.
- Captain matching is based on straight-line distance, not driving ETA.
- Location/search features depend on Mapbox and browser permissions.
- Use production-grade secret rotation, deployment CORS restrictions, rate
  limits, monitoring, and integration tests before public production use.
