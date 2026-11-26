# ServiceHub API Documentation (Week 2)

Base URL (local): `http://localhost:5000/api`

All responses are JSON and use the same shape.

**Success**

```json
{ "success": true, "message": "Services fetched", "data": [ ... ] }
```

List endpoints also return a `pagination` object next to `data`.

**Error**

```json
{ "success": false, "message": "Validation failed", "errors": [ { "field": "title", "message": "Title must be 3 to 100 characters" } ] }
```

`errors` is only present for validation problems (status 400).

## Status codes

| Code | Meaning | Example |
| --- | --- | --- |
| 200 | OK | Fetched, updated or deleted successfully |
| 201 | Created | New service or category created |
| 400 | Bad Request | Validation failed, invalid id, invalid JSON |
| 403 | Forbidden | Request from an origin not allowed by CORS |
| 404 | Not Found | Service or category id does not exist, unknown route |
| 409 | Conflict | Duplicate category name, or deleting a category that still has services |
| 500 | Server Error | Unexpected error (message is hidden in production) |

## Implemented in Week 2

### Health

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Check that the API is running |

### Categories

| Method | Endpoint | Description | Success |
| --- | --- | --- | --- |
| GET | `/api/categories` | List all categories with `serviceCount` | 200 |
| POST | `/api/categories` | Create a category | 201 |
| PUT | `/api/categories/:id` | Update a category | 200 |
| DELETE | `/api/categories/:id` | Delete a category (409 if services use it) | 200 |

Body for POST and PUT:

```json
{ "name": "Gardener", "description": "Lawn and garden care" }
```

Rules: `name` is required, 2 to 40 characters, unique (not case sensitive). `description` is optional, up to 200 characters.

Example item returned by `GET /api/categories`:

```json
{
  "_id": "6b079f281c8eeab2f27c3089",
  "name": "AC Repair",
  "description": "AC servicing, gas filling and repair",
  "createdAt": "2026-11-26T02:53:28.025Z",
  "updatedAt": "2026-11-26T02:53:28.025Z",
  "serviceCount": 1
}
```

### Services

| Method | Endpoint | Description | Success |
| --- | --- | --- | --- |
| GET | `/api/services` | List services with search, filters, sorting and pagination | 200 |
| GET | `/api/services/cities` | List of cities that have services | 200 |
| GET | `/api/services/:id` | One service with category and provider | 200 |
| POST | `/api/services` | Create a service | 201 |
| PUT | `/api/services/:id` | Update a service (send all fields) | 200 |
| DELETE | `/api/services/:id` | Delete a service | 200 |

**Query parameters for `GET /api/services`** (all optional)

| Parameter | Example | Meaning |
| --- | --- | --- |
| `search` | `wiring` | Text found in title or description (not case sensitive) |
| `category` | `6b079f28...` | Category id |
| `city` | `Lahore` | Exact city, not case sensitive |
| `minPrice`, `maxPrice` | `1000`, `5000` | Price range in Rs |
| `sort` | `newest` (default), `price_asc`, `price_desc`, `rating` | Sort order |
| `page`, `limit` | `2`, `9` | Pagination. `limit` is 1 to 50, default 9 |

**Body for POST and PUT**

```json
{
  "title": "House Wiring and Switch Repair",
  "category": "<category id>",
  "description": "Fix faulty switches, sockets and wiring problems.",
  "price": 1500,
  "durationMinutes": 60,
  "city": "Lahore",
  "workingDays": ["Mon", "Tue", "Wed", "Thu", "Fri"],
  "startTime": "09:00",
  "endTime": "18:00"
}
```

**Validation rules**

| Field | Rule |
| --- | --- |
| title | 3 to 100 characters |
| description | 10 to 1000 characters |
| category | valid id of an existing category (404 if it does not exist) |
| price | number, 0 or more |
| durationMinutes | whole number, 15 to 480 |
| city | required |
| workingDays | at least one of Mon, Tue, Wed, Thu, Fri, Sat, Sun |
| startTime, endTime | `HH:MM` (24 hour). End must be after start, and the duration must fit inside the working hours |

The fields `provider`, `averageRating`, `reviewCount` and `isActive` cannot be set by the client; they are ignored if sent.

**Example response of `GET /api/services?limit=1&search=wiring`**

```json
{
  "success": true,
  "message": "Services fetched",
  "data": [
    {
      "_id": "6b079f281c8eeab2f27c308c",
      "provider": { "_id": "6b079f271c8eeab2f27c3082", "name": "Demo Provider", "city": "Lahore" },
      "category": { "_id": "6b079f281c8eeab2f27c3084", "name": "Electrician" },
      "title": "House Wiring and Switch Repair",
      "description": "Fix faulty switches, sockets and wiring problems. Tools and basic fittings included.",
      "price": 1500,
      "durationMinutes": 60,
      "city": "Lahore",
      "workingDays": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      "startTime": "09:00",
      "endTime": "18:00",
      "averageRating": 0,
      "reviewCount": 0,
      "isActive": true
    }
  ],
  "pagination": { "page": 1, "limit": 1, "total": 1, "pages": 1 }
}
```

### Try it with curl

```bash
curl http://localhost:5000/api/health
curl "http://localhost:5000/api/services?city=Lahore&sort=price_asc"
curl -X POST http://localhost:5000/api/categories -H "Content-Type: application/json" -d '{"name":"Gardener"}'
```

## Planned for Week 3

These endpoints are in the design document but are not built yet.

| Module | Endpoints |
| --- | --- |
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Users | `PUT /api/users/me`, `GET /api/users`, `PATCH /api/users/:id/status` |
| Bookings | `POST /api/bookings`, `GET /api/bookings/my`, `GET /api/bookings/provider`, `PATCH /api/bookings/:id/status`, `PATCH /api/bookings/:id/cancel` |
| Services | `GET /api/services/:id/slots`, `GET /api/services/my` |
| Reviews | `POST /api/reviews`, `DELETE /api/reviews/:id` |
| Admin | `GET /api/admin/stats` |

In Week 3 the category and service write endpoints will also be protected with JWT and role checks (admin for categories, provider for services).
