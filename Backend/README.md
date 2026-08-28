# Backend API Documentation

## Register User

Creates a new user account and returns an authentication token.

### Endpoint

```http
POST /user/register
```

When running locally with the default port:

```text
http://localhost:3000/user/register
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
POST /user/login
```

When running locally with the default port:

```text
http://localhost:3000/user/login
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
GET /user/profile
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
GET /user/logout
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
