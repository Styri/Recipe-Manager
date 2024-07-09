require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const logger = require("./middleware/logger");
const pool = require("./config/db");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
const recipeRoutes = require("./routes/recipes");
app.use(recipeRoutes);

app.listen(3000, () => {
  logger.info("Listening on port 3000");
});
