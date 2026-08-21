# Movie Ticket Booking API

A RESTful movie ticket booking backend built with Node.js, Express, TypeScript, MongoDB, and Mongoose. The API supports user authentication, role-based access control, movie and showtime management, seat bookings, and customer movie ratings and reviews.

## Project Overview

The service exposes JSON APIs under the `/api` prefix. Customers can browse active movies, inspect showtimes, reserve seats, view their bookings, and rate movies they have attended. Cinema administrators can manage movies and showtimes and inspect all bookings. Swagger UI is available for interactive API exploration.

Movie rating statistics are stored directly on each Movie document as `averageRating` and `totalRatings`. They are recalculated when a rating is created or deleted, so movie listing requests do not calculate ratings with aggregation.

## Features

- Customer and cinema administrator authentication
- JWT-based authentication
- Role-based authorization for customers and cinema administrators
- Password hashing with bcrypt
- Movie creation, listing, filtering, sorting, updating, and soft deletion
- Showtime creation, listing, updating, deletion, and available-seat lookup
- Seat booking with capacity and duplicate-seat protection
- In-memory booking locking per showtime to reduce concurrent booking conflicts
- Customer booking history and cancellation
- Movie ratings and optional reviews
- Eligibility checks before rating a movie
- Stored movie rating statistics
- Pagination with configurable page and limit values
- Nested Mongoose population for bookings and ratings
- Zod request validation
- Centralized application error handling
- Request logging with method, URL, status, duration, and client IP
- Swagger/OpenAPI documentation at `/api-docs`

## Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Web framework | Express 5 |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JSON Web Tokens (`jsonwebtoken`) |
| Password hashing | `bcrypt` |
| Validation | Zod |
| API documentation | Swagger JSDoc and Swagger UI Express |
| Development runner | `ts-node` and `nodemon` |

## Project Structure

```text
movie-ticket-booking-api/
├── src/
│   ├── config/
│   │   ├── db.ts                 # MongoDB connection
│   │   └── swagger.ts            # Swagger/OpenAPI setup
│   ├── error/
│   │   └── AppError.ts           # Application error class
│   ├── middlewares/
│   │   ├── auth.middleware.ts    # JWT authentication and role checks
│   │   ├── logger.middleware.ts   # Request logging
│   │   └── validate.middleware.ts# Zod validation middleware
│   ├── models/
│   │   ├── booking.model.ts
│   │   ├── movie.model.ts
│   │   ├── rating.model.ts
│   │   ├── showtime.model.ts
│   │   └── user.model.ts
│   ├── modules/
│   │   ├── auth/
│   │   ├── booking/
│   │   ├── movie/
│   │   ├── movies/
│   │   ├── ratings/
│   │   └── showtime/
│   ├── utils/
│   │   ├── bookingLock.ts
│   │   ├── errorHandler.ts
│   │   ├── pagination.ts
│   │   └── time.ts
│   └── server.ts                  # Express application and route registration
├── .env.example
├── package.json
├── package-lock.json
└── tsconfig.json
```

The `src/modules/movies/` directory is present in the repository structure but does not currently contain an implemented route or service. Movie functionality is implemented under `src/modules/movie/`.

## Installation & Setup

### Prerequisites

- Node.js compatible with the installed TypeScript and dependency versions
- A running MongoDB instance, local or hosted
- npm

### Install dependencies

```bash
npm install
```

### Configure environment variables

Copy the example file to `.env`:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Update `JWT_SECRET` before running the application. The `.env` file is ignored by Git.

## Environment Variables

| Variable | Required | Example | Description |
|---|---:|---|---|
| `PORT` | Yes | `5000` | Port used by the Express server |
| `MONGO_URL` | Yes | `mongodb://localhost:27017/MovieTicketBooking` | MongoDB connection string |
| `JWT_SECRET` | Yes | `replace-with-a-long-random-secret` | Secret used to sign and verify JWTs |
| `JWT_EXPIRES_IN` | No | `7d` | JWT lifetime; defaults to `7d` in the auth service |
| `NODE_ENV` | No | `development` | Runtime environment value available to the application |

Example:

```env
PORT=5000
MONGO_URL="mongodb://localhost:27017/MovieTicketBooking"
JWT_EXPIRES_IN="7d"
JWT_SECRET="replace-with-a-secure-secret"
NODE_ENV=development
```

## Running the Project

Start the development server with automatic reloads:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:5000
```

The actual port is controlled by `PORT`.


## API Documentation / Main Endpoints

Base API prefix:

```text
/api
```

Swagger UI:

```text
GET /api-docs
```

All JSON request bodies should use:

```http
Content-Type: application/json
```

Authenticated endpoints use:

```http
Authorization: Bearer <JWT>
```

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a customer or cinema administrator |
| `POST` | `/api/auth/login` | Public | Authenticate and receive a JWT |
| `GET` | `/api/auth/me` | Authenticated users | Return the current user and role |

Registration requires `fullName`, `email`, and `password`. The optional role is `CUSTOMER` or `CINEMA_ADMIN`. Passwords must be 8-72 characters and include a lowercase letter, uppercase letter, and number.

### Movies

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/movies` | Public | List active movies with pagination, filters, and rating sorting |
| `GET` | `/api/movies/:id` | Public | Get one active movie |
| `POST` | `/api/movies` | `CINEMA_ADMIN` | Create a movie |
| `PATCH` | `/api/movies/:id` | `CINEMA_ADMIN` | Update a movie |
| `DELETE` | `/api/movies/:id` | `CINEMA_ADMIN` | Soft-delete a movie |

Movie creation and update fields are `title`, `genre`, `duration`, `description`, `posterUrl`, and `status`. The status is `NOW_SHOWING` or `COMING_SOON`. Rating statistics are server-maintained and must not be supplied by clients.

Movie list query parameters:

- `page`: integer, minimum `1`, default `1`
- `limit`: integer from `1` to `100`, default `10`
- `title`: case-insensitive title search
- `genre`: case-insensitive genre search
- `status`: `NOW_SHOWING` or `COMING_SOON`
- `date`: showtime date filter string
- `showtime`: showtime start value, either `HH:MM` or minutes from midnight
- `sort`: `rating_asc` or `rating_desc`

`rating_asc` and `rating_desc` sort by the stored `averageRating` field. Without a rating sort, movies use descending `_id` order.

A movie response includes fields such as:

```json
{
  "_id": "movie-id",
  "title": "Interstellar",
  "genre": "Sci-Fi",
  "duration": 169,
  "description": "A team of explorers travels through a wormhole.",
  "posterUrl": "https://example.com/interstellar.jpg",
  "averageRating": 0,
  "totalRatings": 0,
  "status": "NOW_SHOWING",
  "isDeleted": false
}
```

### Showtimes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/showtimes` | `CINEMA_ADMIN` | Create a showtime |
| `GET` | `/api/showtimes` | Any authenticated user | List upcoming and currently active showtimes |
| `GET` | `/api/showtimes/:id` | `CINEMA_ADMIN` | Get a showtime with its movie |
| `PUT` | `/api/showtimes/:id` | `CINEMA_ADMIN` | Update a showtime |
| `DELETE` | `/api/showtimes/:id` | `CINEMA_ADMIN` | Delete a showtime when business rules allow |
| `GET` | `/api/showtimes/:id/seats` | `CUSTOMER` or `CINEMA_ADMIN` | Get booked and available seats |

Showtime fields include:

- `movie`: valid Movie ObjectId
- `hallNumber`: positive integer
- `date`: valid date
- `startTime`: integer minutes from midnight, `0-1439`
- `endTime`: integer minutes from midnight, `0-1439`
- `ticketPrice`: positive number
- `totalCapacity`: positive integer

The create and update validation requires `startTime < endTime`. The service prevents overlapping showtimes in the same hall and date. Showtimes are returned with formatted `HH:MM` start and end times in relevant service responses.

The showtime list excludes showtimes that have ended. The controller currently calls the service without forwarding query pagination arguments, so the service's default pagination is used for this endpoint.

The seats endpoint returns the total capacity, booked seats, and generated available seat labels such as `A1`, `A2`, and `B1`. Cancelled bookings do not occupy seats.

### Bookings

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/bookings` | `CUSTOMER` | List the authenticated customer's bookings |
| `POST` | `/api/bookings` | `CUSTOMER` | Create a confirmed booking |
| `GET` | `/api/bookings/all` | `CINEMA_ADMIN` | List all bookings |
| `GET` | `/api/bookings/:id` | `CUSTOMER` | Get one booking owned by the customer |
| `PATCH` | `/api/bookings/:id/cancel` | `CUSTOMER` | Cancel a booking before the showtime starts |

Create a booking with:

```json
{
  "showtimeId": "showtime-object-id",
  "selectedSeats": ["A1", "A2"]
}
```

Booking rules include:

- At least one seat is required.
- Seat strings cannot be empty.
- Duplicate seats in one request are rejected.
- Already booked seats are rejected unless their previous booking is cancelled.
- The showtime must exist and not have started.
- The requested seats cannot exceed showtime capacity.
- Total price is calculated as `selectedSeats.length * ticketPrice`.
- New bookings are created with `CONFIRMED` status.
- A short-lived in-memory lock prevents concurrent booking operations for the same showtime within one server process.
- Customers can only view and cancel their own bookings.
- A booking cannot be cancelled after the movie has started or if it is already cancelled.

Customer booking responses populate the showtime and nested movie. Administrator booking responses also populate safe customer identity fields.

### Ratings and Reviews

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/ratings` | `CUSTOMER` | Create a movie rating and optional review |
| `GET` | `/api/ratings/my` | `CUSTOMER` | List the authenticated customer's ratings |
| `GET` | `/api/ratings/movie/:movieId` | Public | List ratings and reviews for a movie |
| `DELETE` | `/api/ratings/:id` | Customer owner or `CINEMA_ADMIN` | Delete a rating |

Rating request fields:

- `movie`: valid Movie ObjectId
- `rating`: number from `1` to `5`
- `review`: optional trimmed string with a maximum length of `1000`

Clients do not provide `customer`; it is taken from the authenticated JWT user. A customer can rate a movie only when:

1. The movie exists and is not soft-deleted.
2. The customer has a `CONFIRMED` booking for the movie.
3. At least one relevant showtime has already finished.
4. The customer has not already rated the movie.

The Rating model enforces a unique `{ customer, movie }` index. After a rating is created or deleted, the service recalculates the Movie document's `averageRating` and `totalRatings`. The average is rounded to one decimal place. Rating aggregation is used only by this statistics update helper, not by movie listing requests.

The public movie-ratings endpoint supports:

- `page`: integer, minimum `1`
- `limit`: integer from `1` to `100`

It verifies that the Movie exists and is not deleted, then populates only the customer's `_id` and `fullName`.

## Authentication & Authorization

Authentication uses JWTs sent in the `Authorization` header:

```http
Authorization: Bearer <token>
```

The token contains the user ID as its subject and the user's role as a claim. The authentication middleware verifies the token, loads the user without the password, validates the role, and attaches the user to the request.

Supported roles:

- `CUSTOMER`
- `CINEMA_ADMIN`

Authorization is applied per route. A missing or invalid token returns `401`. A valid token with an insufficient role returns `403`.

Passwords are hashed with bcrypt before storage and are never included in authenticated user responses.

## Database Models / Relationships

| Model | Important fields | Relationships |
|---|---|---|
| User | `fullName`, `email`, hashed `password`, `role` | Referenced by Booking and Rating |
| Movie | `title`, `genre`, `duration`, `description`, `posterUrl`, `averageRating`, `totalRatings`, `status`, `isDeleted` | Referenced by Showtime and Rating |
| Showtime | `movie`, `hallNumber`, `date`, `startTime`, `endTime`, `ticketPrice`, `totalCapacity` | References Movie; referenced by Booking |
| Booking | `customer`, `showtime`, `selectedSeats`, `totalPrice`, `bookingStatus` | References User and Showtime |
| Rating | `customer`, `movie`, `rating`, `review` | References User and Movie; unique per customer/movie pair |

All models use timestamps and disable Mongoose's default `versionKey`.

## Validation & Error Handling

Zod schemas validate request bodies, path parameters, and query parameters before controllers run. Common validation includes:

- MongoDB ObjectId format checks
- Required and optional fields
- Numeric ranges and integer requirements
- Enum values for roles, movie statuses, and booking statuses
- URL validation for movie posters
- Email normalization and validation
- Password complexity rules
- Seat uniqueness and minimum selection count
- Review length limits
- Pagination limits

Validation failures return HTTP `422` with a response shaped like:

```json
{
  "success": false,
  "message": "body:field : validation message"
}
```

Expected application errors use `AppError` and return:

```json
{
  "success": false,
  "message": "Description of the error"
}
```

Unexpected errors are logged to the server console and return HTTP `500` with a generic message. Common application status codes are `400`, `401`, `403`, `404`, `409`, `422`, and `500`.

## Pagination, Filtering & Sorting

The shared `paginate()` utility performs Mongoose filtering, skip/limit pagination, sorting, optional population, and total-count calculation. Its response includes:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

The general utility defaults to page `1` and limit `10`, while the shared pagination validation schema defaults the query limit to `1`. Routes that use the validation schema therefore may receive a default limit of `1`, including booking and rating list endpoints. Movie validation explicitly defaults its limit to `10`.

The maximum accepted limit is `100`. Movie reads support title, genre, status, date, showtime, and stored-rating sorting. Booking and rating list endpoints restrict results according to the authenticated user or requested movie.

## Soft Delete

Movies use an `isDeleted` boolean field with a default of `false`. Movie deletion updates this field rather than physically removing the document. Movie listing, single-movie lookup, and rating eligibility checks include `isDeleted: false`, so deleted movies are not exposed through those flows.

## Logging

The logger middleware is registered globally before the API routers. It records a line after every response finishes:

```text
[ISO timestamp] METHOD /path STATUS - durationms - IP: client-ip
```

The logger includes:

- ISO timestamp
- HTTP method
- Original request URL
- Response status code
- Request duration in milliseconds
- Client IP address

Logging currently uses `console.log`; no external log aggregation or log file transport is configured.

## API Servers

Swagger defines these server URLs:

- Production: `https://movie-ticket-booking-api-production.up.railway.app/`
- Local: `http://localhost:<PORT>`

The production URL is documentation configuration only; deployment and infrastructure settings are not defined in this repository.

## Team Members

| Member | Role / Responsibilities |
|---|---|
| Ahmed Abd El-Latif | Team Leader & Bookings & Reviews |
| Abdullah Samir | Authentication & Authorization |
| Mostafa Nasser | Showtimes |
| Zeyad Mohammed | Movies |
|
