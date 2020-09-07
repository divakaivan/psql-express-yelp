const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: process.env.DB_PASS,
  host: "localhost",
  port: 5432,
  database: "pernyelp",
});
module.exports = {
  query: (text, params) => pool.query(text, params),
};
