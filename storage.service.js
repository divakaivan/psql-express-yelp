const db = require("./db");

const getAllRestaurantsData = () => {
  return db.query(
    `SELECT * FROM restaurants 
    LEFT JOIN 
        (
            SELECT 
                restaurant_id, 
                COUNT(*), 
                TRUNC(AVG(rating),1) AS average_rating 
            FROM reviews 
            GROUP BY restaurant_id
        ) reviews on restaurants.id = reviews.restaurant_id;`
  );
};

const getRestaurantData = (id) => {
  return db.query(
    `SELECT * FROM restaurants 
    LEFT JOIN 
        (
            SELECT 
                restaurant_id, 
                COUNT(*), 
                TRUNC(AVG(rating),1) AS average_rating 
            FROM reviews 
            GROUP BY restaurant_id
        ) reviews on restaurants.id = reviews.restaurant_id WHERE id = $1`,
    [id]
  );
};

const getRestaurantReviews = (id) => {
  return db.query("SELECT * FROM reviews WHERE restaurant_id = $1", [id]);
};

const createRestaurant = (name, location, price_range) => {
  return db.query(
    "INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3) returning *",
    [name, location, price_range]
  );
};

const updateRestaurant = (name, location, price_range, id) => {
  return db.query(
    "UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4 returning *",
    [name, location, price_range, id]
  );
};

const deleteRestaurant = (id) => {
  return db.query("DELETE FROM restaurants WHERE id = $1", [id]);
};

const addReview = (id, name, review, rating) => {
  return db.query(
    "INSERT INTO reviews (restaurant_id, name, review, rating) values ($1, $2, $3, $4) returning *;",
    [id, name, review, rating]
  );
};

module.exports = {
  getAllRestaurantsData,
  getRestaurantData,
  getRestaurantReviews,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  addReview,
};
