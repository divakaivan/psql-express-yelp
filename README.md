## RESTful Node.js/Express backend for a restaurant review application

It connects to a PostgreSQL database and allows clients to perform CRUD operations on restaurant data and manage reviews

## API Endpoints

| Method | Endpoint         | Description                             |
| ------ | ---------------- | --------------------------------------- |
| GET    | `/`              | Get all restaurants (w/ avg ratings)    |
| GET    | `/:id`           | Get a specific restaurant + its reviews |
| POST   | `/`              | Create a new restaurant                 |
| PUT    | `/:id`           | Update a restaurant                     |
| DELETE | `/:id`           | Delete a restaurant                     |
| POST   | `/:id/addReview` | Add a review to a specific restaurant   |

## Structure

```
├── controllers.js           # controller layer (only used for 1 route now)
├── server.js                # main entrypoint, route handlers defined here
├── storage.service.js       # db queries
├── db/
│   ├── index.js             # Postgres client config
│   └── db.sql               # SQL schema and sample query
```
