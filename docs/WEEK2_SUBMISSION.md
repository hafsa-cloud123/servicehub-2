# Week 2 Submission – Full-Stack Core Development

**Project:** ServiceHub – Local Service Booking Platform
**Intern:** [Hafsa Mudassar]
**Goal of the week:** connect React → API → Express → MongoDB with at least one complete end-to-end feature.

## Completed features

**Backend (Node.js, Express, Mongoose)**

- Modular Express server: routes, controllers, models, middleware, config and utils folders
- Environment configuration with `.env` (and `.env.example` without secrets)
- MongoDB connection with Mongoose (local MongoDB or MongoDB Atlas)
- All five models from the Week 1 design: User, Category, Service, Booking, Review, with schema validation and references
- bcrypt password hashing built into the User model
- Unique partial index on bookings that prevents double booking at database level
- Categories API: list (with service counts), create, update, delete
- Services API: list with search, category, city and price filters, sorting and pagination; get one; create; update; delete; list of cities
- Request validation with express-validator and Mongoose, correct status codes (200, 201, 400, 403, 404, 409, 500)
- Custom error class and central error-handling middleware with one consistent error format
- Seed script with demo categories, services and users

**Frontend (React, React Router, Axios)**

- Component-based structure: pages, reusable components, custom hooks, API service layer
- Pages: Home, Services (search, filters, pagination), Service Detail, Add Service, Edit Service, Categories, 404
- Controlled forms with client-side validation and server error display
- Loading states, error messages with a retry button, empty states and success messages
- Filters stored in the URL, so a filtered page can be refreshed or shared
- Responsive layout (desktop and mobile)

**End-to-end features (full flow works)**

1. Service catalogue: React form → API request → Express route → controller → Mongoose → MongoDB → response → React UI (create, read, update, delete)
2. Category management: add, edit, delete with duplicate and in-use checks

## Known issues and blockers

| Issue | Plan |
| --- | --- |
| No login yet. Every new service is assigned to the seeded demo provider, and anyone can call the create, update and delete endpoints | Week 3: JWT authentication and role-based access control |
| Booking, review, user and admin APIs are not built yet (their models exist) | Week 3 |
| No automated tests yet | Week 3 and 4: Postman collection and functional testing |
| Search uses a case-insensitive text match on title and description, not a MongoDB text index (so partial words like "elec" are found) | Acceptable for now; can be revisited |
| Not deployed yet | Week 4: Vercel (frontend), Render or Railway (backend), MongoDB Atlas |

## What to show in the demo video or screenshots

1. Backend running in the terminal and `GET /api/health` in the browser
2. Home page, then search and filters on the Services page, then page 2
3. Add a new service (show a validation error first, then a successful save)
4. Edit and delete the service
5. Categories page: add, duplicate error, delete a category that is in use
6. The data inside MongoDB (Atlas or Compass)
7. Git commit history on GitHub

Screenshots of the working app are in `docs/screenshots/`. Replace or add your own from your computer.
