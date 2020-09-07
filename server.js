require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Get all Restaurants
app.get("/api/v1/restaurants", async (req, res) => {
  try {
    //const results = await db.query("select * from restaurants");
    const restaurantRatingsData = await db.query(
      "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;"
    );

    res.status(200).json({
      status: "success",
      results: restaurantRatingsData.rows.length,
      data: {
        restaurants: restaurantRatingsData.rows,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      data: { error },
    });
  }
});

//Get a Restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const restaurant = await db.query(
      "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1",
      [req.params.id]
    );

    // If there is no restaurant found
    if (restaurant.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        data: {
          error: "Restaurant with the given id DOES NOT exist",
        },
      });
    }

    // get reviews for the found restaurant
    const reviews = await db.query(
      "select * from reviews where restaurant_id = $1",
      [req.params.id]
    );

    res.status(200).json({
      status: "success",
      data: {
        restaurant: restaurant.rows[0],
        reviews: reviews.rows,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      data: { error },
    });
  }
});

// Create a Restaurant

app.post("/api/v1/restaurants", async (req, res) => {
  try {
    const results = await db.query(
      "INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3) returning *",
      [req.body.name, req.body.location, req.body.price_range]
    );

    res.status(201).json({
      status: "success",
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      data: {
        error,
        message: "Could not add a new restaurant",
      },
    });
  }
});

// Update Restaurants

app.put("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const results = await db.query(
      "UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *",
      [req.body.name, req.body.location, req.body.price_range, req.params.id]
    );

    res.status(200).json({
      status: "success",
      data: {
        retaurant: results.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      data: {
        error,
        message: "Could not update the restaurant info.",
      },
    });
  }
});

// Delete Restaurant

app.delete("/api/v1/restaurants/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM restaurants where id = $1", [req.params.id]);

    res.status(204).json({
      status: "sucess",
      data: { message: "Restaurant deleted!" },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      data: { error, message: "Could not delete the restaurant!" },
    });
  }
});

app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
  try {
    const newReview = await db.query(
      "INSERT INTO reviews (restaurant_id, name, review, rating) values ($1, $2, $3, $4) returning *;",
      [req.params.id, req.body.name, req.body.review, req.body.rating]
    );

    res.status(201).json({
      status: "success",
      data: {
        review: newReview.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      data: { error, message: "Could not add a review to the restaurant!" },
    });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`server is up and listening on port ${port}`);
});
