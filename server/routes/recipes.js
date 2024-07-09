const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

router.post("/recipes", recipeController.createRecipe);
router.get("/recipes", recipeController.getAllRecipes);
router.get("/recipes/favorites", recipeController.getFavoriteRecipes);
router.put("/recipes/:id", recipeController.updateRecipeDescription);
router.delete("/recipes/:id", recipeController.deleteRecipe);
router.get("/recipes/sort", recipeController.sortRecipesByCategory);
router.put("/recipes/:id/favorite", recipeController.toggleRecipeFavorite);
router.get("/recipes/stats", recipeController.getRecipeStats);
router.get("/recipes/search", recipeController.searchRecipes);

module.exports = router;
