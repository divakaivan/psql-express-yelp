require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
const {
  getAllRestaurantsData,
  getRestaurantData,
  getRestaurantReviews,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  addReview,
} = require("./storage.service");

// Get all Restaurants
app.get("/api/v1/restaurants", async (req, res) => {
  try {
    const restaurantRatingsData = await getAllRestaurantsData();

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
    const restaurant = await getRestaurantData(req.params.id);

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
    const reviews = await getRestaurantReviews(req.params.id);

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
  const { name, location, price_range } = req.body;
  try {
    const results = await createRestaurant(name, location, price_range);

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
  const { name, location, price_range } = req.body;
  const { id } = req.params;
  try {
    const results = await updateRestaurant(name, location, price_range, id);

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
    await deleteRestaurant(req.params.id);

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
  const { id } = req.params;
  const { name, review, rating } = req.body;
  try {
    const newReview = await addReview(id, name, review, rating);

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

// TODO: add error handling for when review/rating is not between 1 and 5 for all
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`server is up and listening on port ${port}`);
});
