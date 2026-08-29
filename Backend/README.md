# Backend API Documentation

## Register User

Creates a new user account and returns an authentication token.

### Endpoint

```http
POST /users/register
```

When running locally with the default port:

```text
http://localhost:3000/users/register
```

### Required Data

The request body must be JSON and include:

- `email`: A valid email address.
- `fullname.firstname`: At least 3 characters long.
- `password`: At least 6 characters long.

`fullname.lastname` is optional.

### Request Body

```json
{
  "fullname": {
    "firstname": "Sabeel",
    "lastname": "Ahmed"
  },
  "email": "sabeel@example.com",
  "password": "secret123"
}
```

### Successful Response

**Status code: `201 Created`**

```json
{
  "token": "jwt-token",
  "user": {
    "fullname": {
      "firstname": "Sabeel",
      "lastname": "Ahmed"
    },
    "email": "sabeel@example.com"
  }
}
```

### Status Codes

| Status code | Description |
| --- | --- |
| `201 Created` | User registered successfully. |
| `400 Bad Request` | Required data is missing or invalid. The response includes validation errors. |
| `500 Internal Server Error` | An unexpected error occurred while registering the user. |

### Validation Error Response

```json
{
  "errors": [
    {
      "type": "field",
      "value": "bad-email",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

## Login User

Authenticates an existing user and returns an authentication token.

### Endpoint

```http
POST /users/login
```

When running locally with the default port:

```text
http://localhost:3000/users/login
```

### Required Data

The request body must be JSON and include:

- `email`: A valid email address.
- `password`: At least 6 characters long.

### Request Body

```json
{
  "email": "sabeel@example.com",
  "password": "secret123"
}
```

### Successful Response

**Status code: `200 OK`**

```json
{
  "token": "jwt-token",
  "user": {
    "email": "sabeel@example.com",
    "password": "hashed-password"
  }
}
```

### Status Codes

| Status code | Description |
| --- | --- |
| `200 OK` | User authenticated successfully. |
| `400 Bad Request` | Email or password is missing or invalid. The response includes validation errors. |
| `401 Unauthorized` | The email or password is incorrect. |

### Authentication Error Response

```json
{
  "message": "Invalid email or password"
}
```

## Get User Profile

Returns the profile of the currently authenticated user.

### Endpoint

```http
GET /users/profile
```

This endpoint requires authentication. Send the JWT in either an HTTP-only
`token` cookie or the `Authorization` header using the Bearer scheme:

```http
Authorization: Bearer <jwt-token>
```

### Successful Response

**Status code: `200 OK`**

The response contains the authenticated user's profile data.

```json
{
  "_id": "user-id",
  "fullname": {
    "firstname": "Sabeel",
    "lastname": "Ahmed"
  },
  "email": "sabeel@example.com"
}
```

### Status Codes

| Status code | Description |
| --- | --- |
| `200 OK` | User profile returned successfully. |
| `401 Unauthorized` | Authentication token is missing, invalid, or blacklisted. |

## Logout User

Logs out the currently authenticated user, clears the authentication cookie,
and blacklists the token.

### Endpoint

```http
GET /users/logout
```

This endpoint requires authentication. Send the JWT in either the `token`
cookie or the `Authorization` header:

```http
Authorization: Bearer <jwt-token>
```

### Successful Response

**Status code: `200 OK`**

```json
{
  "message": "Logged Out"
}
```

### Status Codes

| Status code | Description |
| --- | --- |
| `200 OK` | User logged out successfully. |
| `401 Unauthorized` | Authentication token is missing, invalid, or blacklisted. |

## Register Captain

Creates a new captain account with vehicle details and returns an authentication token.

### Endpoint

```http
POST /captains/register
```

When running locally with the default port:

```text
http://localhost:3000/captains/register
```

### Required Data

The request body must be JSON and include:

- `email`: A valid email address.
- `fullname.firstname`: At least 3 characters long.
- `password`: At least 6 characters long.
- `vehicle.color`: At least 3 characters long.
- `vehicle.plate`: At least 3 characters long.
- `vehicle.capacity`: An integer of at least 1.
- `vehicle.vehicleType`: One of `car`, `bike`, or `rikshaw`.

`fullname.lastname` is optional.

### Request Body

```json
{
  "fullname": {
    "firstname": "Sabeel",
    "lastname": "Ahmed"
  },
  "email": "captain@example.com",
  "password": "secret123",
  "vehicle": {
    "color": "Black",
    "plate": "ABC-123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Successful Response

**Status code: `201 Created`**

```json
{
  "token": "jwt-token",
  "captain": {
    "fullname": {
      "firstname": "Sabeel",
      "lastname": "Ahmed"
    },
    "email": "captain@example.com",
    "vehicle": {
      "color": "Black",
      "plate": "ABC-123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

### Status Codes

| Status code | Description |
| --- | --- |
| `201 Created` | Captain registered successfully. |
| `400 Bad Request` | Required data is missing or invalid, or the captain email already exists. The response includes validation errors or an error message. |

## Login Captain

Authenticates an existing captain and returns an authentication token.

### Endpoint

```http
POST /captains/login
```

When running locally with the default port:

```text
http://localhost:3000/captains/login
```

### Required Data

The request body must be JSON and include:

- `email`: A valid email address.
- `password`: At least 6 characters long.

### Request Body

```json
{
  "email": "captain@example.com",
  "password": "secret123"
}
```

### Successful Response

**Status code: `200 OK`**

```json
{
  "token": "jwt-token",
  "captain": {
    "_id": "captain-id",
    "fullname": {
      "firstname": "Sabeel",
      "lastname": "Ahmed"
    },
    "email": "captain@example.com",
    "vehicle": {
      "color": "Black",
      "plate": "ABC-123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

### Status Codes

| Status code | Description |
| --- | --- |
| `200 OK` | Captain authenticated successfully. |
| `400 Bad Request` | Email or password is missing or invalid. The response includes validation errors. |
| `401 Unauthorized` | The email or password is incorrect. |

### Authentication Error Response

```json
{
  "message": "Invalid email or password"
}
```

## Get Captain Profile

Returns the profile of the currently authenticated captain.

### Endpoint

```http
GET /captains/profile
```

This endpoint requires authentication. Send the JWT in either an HTTP-only
`token` cookie or the `Authorization` header using the Bearer scheme:

```http
Authorization: Bearer <jwt-token>
```

### Successful Response

**Status code: `200 OK`**

The response contains the authenticated captain's profile data.

```json
{
  "captain": {
    "_id": "captain-id",
    "fullname": {
      "firstname": "Sabeel",
      "lastname": "Ahmed"
    },
    "email": "captain@example.com",
    "vehicle": {
      "color": "Black",
      "plate": "ABC-123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

### Status Codes

| Status code | Description |
| --- | --- |
| `200 OK` | Captain profile returned successfully. |
| `401 Unauthorized` | Authentication token is missing, invalid, or blacklisted. |

## Logout Captain

Logs out the currently authenticated captain, clears the authentication cookie,
and blacklists the token.

### Endpoint

```http
POST /captains/logout
```

This endpoint requires authentication. Send the JWT in either the `token`
cookie or the `Authorization` header:

```http
Authorization: Bearer <jwt-token>
```

### Successful Response

**Status code: `200 OK`**

```json
{
  "message": "Logged out successfully"
}
```

### Status Codes

| Status code | Description |
| --- | --- |
| `200 OK` | Captain logged out successfully. |
| `401 Unauthorized` | Authentication token is missing, invalid, or blacklisted. |
