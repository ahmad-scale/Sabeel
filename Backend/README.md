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
