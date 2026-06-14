# API Documentation

All API routes respond with JSON. The API is rate-limited automatically based on NextAuth session status or IP address.

## Endpoints

### 1. `POST /api/footprint/calc`
Calculates the carbon footprint based on lifestyle inputs. If the user is authenticated, the result is automatically persisted to the database.

**Rate Limit:**
- Anonymous: 10 requests / minute
- Authenticated: 100 requests / minute

**Request (JSON):**
```json
{
  "transport": {
    "hasCar": true,
    "carFuel": "gasoline",
    "carMiles": 12000,
    "flightShortHaul": 2,
    "flightLongHaul": 0
  },
  "energy": {
    "kwhPerMonth": 400,
    "heatSource": "naturalGas"
  },
  "food": {
    "diet": "omnivore"
  },
  "waste": {
    "recyclePaper": true,
    "recyclePlastic": false,
    "compost": false
  }
}
```

**Response (200 OK):**
```json
{
  "totalCO2": 14.2,
  "breakdown": {
    "transport": 6.5,
    "energy": 3.2,
    "food": 3.8,
    "waste": 0.7
  },
  "recordId": "clx123abc000..." // Only present if authenticated
}
```

### 2. `GET /api/footprint/history`
Retrieves a paginated list of historical calculations for the authenticated user.

**Authentication:** Required (NextAuth session)

**Parameters:**
- `cursor` (string, optional): The ID of the last record received.
- `limit` (number, optional): Defaults to 10.

**Response (200 OK):**
```json
{
  "records": [
    {
      "id": "clx123abc000...",
      "createdAt": "2024-06-12T12:00:00.000Z",
      "totalCO2": 14.2,
      "breakdown": { ... },
      "inputs": { ... }
    }
  ],
  "nextCursor": null
}
```

### 3. `GET /api/health`
Lightweight ping endpoint to verify database connectivity.

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2024-06-12T12:00:00.000Z"
}
```

## Error Handling

Standard HTTP status codes are used:
- **400 Bad Request:** Malformed JSON.
- **401 Unauthorized:** Missing session on protected routes.
- **422 Unprocessable Entity:** Zod schema validation failed. Returns a `details` array outlining the invalid paths.
- **429 Too Many Requests:** Rate limit exceeded. Read the `Retry-After` header.
- **500 Internal Server Error:** Database connection failure.
