const pool = require("../config/db");
const logger = require("../middleware/logger");

const createRecipe = async (req, res) => {
  try {
    const { name, description, category, favorite } = req.body;
    const newRecipe = await pool.query(
      "INSERT INTO recipes (name, description, category, favorite) VALUES ($1, $2, $3, COALESCE($4, FALSE)) RETURNING *",
      [name, description, category, favorite]
    );
    res.status(201).json(newRecipe.rows[0]);
    logger.info(`Recipe created: ${newRecipe.rows[0].name}`);
  } catch (error) {
    logger.error(`Error creating recipe: ${error.message}`);
    res.status(500).send("Server Error");
  }
};

const getAllRecipes = async (req, res) => {
  const { page = 1 } = req.query;
  const limit = 8;
  const offset = (page - 1) * limit;

  try {
    const allRecipes = await pool.query("SELECT * FROM recipes ORDER BY recipe_id LIMIT $1 OFFSET $2",
      [limit, offset]);
    res.json(allRecipes.rows);
  } catch (error) {
    logger.error(`Error fetching recipes: ${error.message}`);
    res.status(500).send("Server error");
  }
};

const getFavoriteRecipes = async (req, res) => {
  const { page = 1 } = req.query;
  const limit = 8;
  const offset = (page - 1) * limit;

  try {
    const favoriteRecipes = await pool.query("SELECT * FROM recipes WHERE favorite = TRUE ORDER BY recipe_id LIMIT $1 OFFSET $2",
      [limit, offset]);
    res.json(favoriteRecipes.rows);
  } catch (error) {
    logger.error(`Error fetching favorite recipes: ${error.message}`);
    res.status(500).send("Server error");
  }
};

const updateRecipeDescription = async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  try {
    const newDescription = await pool.query(
      "UPDATE recipes SET description = $1 WHERE recipe_id = $2 RETURNING *",
      [description, id]
    );
    res.json(newDescription.rows[0]);
    logger.info(`Updated recipe ${id} description`);
  } catch (error) {
    logger.error(`Error updating recipe description: ${error.message}`);
    res.status(500).send("Server error");
  }
};

const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM recipes WHERE recipe_id = $1", [id]);
    res.status(204).send();
    logger.info(`Deleted recipe ${id}`);
  } catch (error) {
    logger.error(`Error deleting recipe: ${error.message}`);
    res.status(500).send("Server error");
  }
};

const sortRecipesByCategory = async (req, res) => {
  const { page = 1 } = req.query;
  const limit = 8;
  const offset = (page - 1) * limit;

  try {
    const sortedRecipes = await pool.query("SELECT * FROM recipes ORDER BY category LIMIT $1 OFFSET $2",
      [limit, offset]
    );
    res.json(sortedRecipes.rows);
  } catch (error) {
    logger.error(`Error sorting recipes: ${error.message}`);
    res.status(500).send("Server error");
  }
};

const toggleRecipeFavorite = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("UPDATE recipes SET favorite = NOT favorite WHERE recipe_id = $1", [id]);
    res.status(204).send();
    logger.info(`Toggled favorite status for recipe ${id}`);
  } catch (error) {
    logger.error(`Error toggling favorite status: ${error.message}`);
    res.status(500).send("Server error");
  }
};

const getRecipeStats = async (req, res) => {
  try {
    const totalRecipes = await pool.query("SELECT COUNT(*) FROM recipes");
    const favoriteRecipes = await pool.query("SELECT COUNT(*) FROM recipes WHERE favorite = true");
    const nonFavoriteRecipes = await pool.query("SELECT COUNT(*) FROM recipes WHERE favorite = false");

    res.json({
      total: totalRecipes.rows[0].count,
      favorite: favoriteRecipes.rows[0].count,
      nonFavorite: nonFavoriteRecipes.rows[0].count,
    });
  } catch (error) {
    logger.error(`Error fetching recipe stats: ${error.message}`);
    res.status(500).send("Server error");
  }
};

const searchRecipes = async (req, res) => {
  const { name = "", description = "", category = "", page = 1 } = req.query;
  const limit = 8;
  const offset = (page - 1) * limit;

  try {
    const searchResults = await pool.query(
      "SELECT * FROM recipes WHERE name ILIKE $1 OR description ILIKE $2 OR category ILIKE $3 ORDER BY recipe_id LIMIT $4 OFFSET $5",
      [`%${name}%`, `%${description}%`, `%${category}%`, limit, offset]
    );
    res.json(searchResults.rows);
  } catch (error) {
    logger.error(`Error searching recipes: ${error.message}`);
    res.status(500).send("Server error");
  }
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getFavoriteRecipes,
  updateRecipeDescription,
  deleteRecipe,
  sortRecipesByCategory,
  toggleRecipeFavorite,
  getRecipeStats,
  searchRecipes
};
