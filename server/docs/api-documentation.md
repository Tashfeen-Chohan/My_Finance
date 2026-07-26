# MyFinance REST API Documentation

Comprehensive guide to the 4-tier RESTful API for **MyFinance** (Vehicle & Financial Tracking Engine).

## Architecture
```
[Routes] → [Controllers] → [Services] → [Repositories] → [MongoDB Database]
```

- **Base URL**: `http://localhost:5000/api`
- **Authentication**: JWT Token stored in `httpOnly` cookie (`accessToken`) or `Authorization: Bearer <token>` header.

---

## 1. Global Response & Error Formats

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message description",
  "details": [ ... ]
}
```

### HTTP Status Codes
| Code | Meaning | Usage |
|---|---|---|
| `200` | OK | Successful fetch, update, or deletion |
| `201` | Created | Resource successfully created |
| `400` | Bad Request | Invalid input parameters or missing fields |
| `401` | Unauthorized | Missing or expired JWT access token |
| `403` | Forbidden | Authenticated user lacks permission |
| `404` | Not Found | Requested entity does not exist |
| `409` | Conflict | Unique identifier conflict (e.g. duplicate key) |
| `422` | Unprocessable Entity | Zod schema validation failure |
| `500` | Internal Server Error | Unhandled server exception |

---

## 2. Authentication Module (`/api/auth`)

### `POST /api/auth/google`
Authenticate using Google ID Token credential or mock dev profile.
- **Request Body**:
```json
{
  "credential": "google_id_token_jwt_string",
  "mockUser": {
    "googleId": "mock-google-id-999",
    "email": "alex.dev@example.com",
    "name": "Alex Dev"
  }
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "66a3d9021a8f9c1234567890",
    "googleId": "109876543210987654321",
    "email": "alex.dev@example.com",
    "name": "Alex Dev",
    "avatarUrl": "https://lh3.googleusercontent.com/a/default-user"
  },
  "accessToken": "eyJhbGciOiJIUzI1Ni..."
}
```

### `POST /api/auth/refresh`
Refresh expired access token using HTTP-only refresh cookie.
- **Response**: `200 OK` (returns new `accessToken` and updates cookies).

### `POST /api/auth/logout`
Revoke active session and clear HTTP-only cookies.
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### `GET /api/auth/me`
Fetch currently authenticated user session profile.
- **Response**: `200 OK`

---

## 3. Vehicles Module (`/api/vehicles`)

### `POST /api/vehicles`
Create a new vehicle record.
- **Request Body**:
```json
{
  "name": "Honda Civic Turbo",
  "make": "Honda",
  "model": "Civic",
  "year": 2022,
  "licensePlate": "LEA-1234",
  "fuelType": "petrol",
  "initialOdometer": 15000,
  "currentOdometer": 15000,
  "currency": "PKR",
  "clientSyncId": "uuid-v4-client-generated-sync-id"
}
```
- **Response**: `201 Created`

### `GET /api/vehicles`
Fetch all non-deleted vehicles owned by the authenticated user.
- **Response**: `200 OK`

### `GET /api/vehicles/:id`
Fetch single vehicle by ID.
- **Response**: `200 OK`

### `PUT /api/vehicles/:id`
Update existing vehicle details.
- **Request Body**: (Partial fields allowed)
```json
{
  "name": "Honda Civic Oriel",
  "currentOdometer": 17500
}
```
- **Response**: `200 OK`

### `DELETE /api/vehicles/:id`
Soft-delete vehicle record.
- **Response**: `200 OK`

---

## 4. Fuel Expenses Module (`/api/fuel-expenses`)

### `POST /api/fuel-expenses`
Record a new fuel refill.
- **Request Body**:
```json
{
  "vehicleId": "66a3d9021a8f9c1234567890",
  "date": "2026-07-26T12:00:00.000Z",
  "odometer": 17850,
  "quantity": 42.5,
  "unitPrice": 275.50,
  "isFullTank": true,
  "stationName": "PSO Main Boulevard",
  "currency": "PKR",
  "clientSyncId": "uuid-v4-client-generated-sync-id"
}
```
- **Response**: `201 Created` (Auto-calculates `totalCost`, `distanceTraveled`, and `computedEconomy` km/L).

### `GET /api/fuel-expenses/vehicle/:vehicleId`
Fetch fuel refill history for a specific vehicle.
- **Response**: `200 OK`

### `GET /api/fuel-expenses/:id`
Fetch single fuel expense details by ID.

### `PUT /api/fuel-expenses/:id`
Update fuel expense record.

### `DELETE /api/fuel-expenses/:id`
Soft-delete fuel expense record.

---

## 5. Maintenance Expenses Module (`/api/maintenance`)

### `POST /api/maintenance`
Record vehicle service or repair work.
- **Request Body**:
```json
{
  "vehicleId": "66a3d9021a8f9c1234567890",
  "date": "2026-07-26T14:30:00.000Z",
  "odometer": 18000,
  "category": "oil_change",
  "title": "Synthetic Engine Oil & Filter Replacement",
  "partsCost": 12000,
  "laborCost": 1500,
  "serviceProvider": "Honda PitStop Service Center",
  "nextServiceOdometer": 23000,
  "nextServiceDate": "2026-11-26T00:00:00.000Z",
  "clientSyncId": "uuid-v4-client-generated-sync-id"
}
```
- **Response**: `201 Created`

### `GET /api/maintenance/upcoming`
Fetch upcoming maintenance service reminders for the authenticated user.
- **Response**: `200 OK`

### `GET /api/maintenance/vehicle/:vehicleId`
Fetch maintenance history for a vehicle.

### `PUT /api/maintenance/:id`
Update maintenance service record.

### `DELETE /api/maintenance/:id`
Soft-delete maintenance record.

---

## 6. Dashboard Module (`/api/dashboard`)

### `GET /api/dashboard/summary`
Fetch aggregated metrics, spend analytics, service alerts, and recent activities.
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "vehicles": {
      "total": 2,
      "active": 2
    },
    "expenses": {
      "totalFuelSpend": 11708.75,
      "totalFuelVolume": 42.5,
      "totalMaintenanceSpend": 13500.00,
      "maintenanceCount": 1,
      "grandTotalSpend": 25208.75
    },
    "upcomingServices": [ ... ],
    "recentActivity": [ ... ]
  }
}
```

---

## 7. User Settings Module (`/api/settings`)

### `GET /api/settings`
Fetch current user profile and application preferences.
- **Response**: `200 OK`

### `PUT /api/settings`
Update user profile name and preferences.
- **Request Body**:
```json
{
  "name": "Alex Dev",
  "preferences": {
    "currency": "USD",
    "distanceUnit": "miles",
    "fuelUnit": "gallons",
    "theme": "dark"
  }
}
```
- **Response**: `200 OK`
