require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use the .env file for credentials
});

// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
