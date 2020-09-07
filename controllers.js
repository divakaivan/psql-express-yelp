const { getAllRestaurantsData } = require("./storage.service");

const getAllRestaurantsDataController = async (req, res) => {
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
};

module.exports = { getAllRestaurantsDataController };
