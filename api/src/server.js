require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 5000;
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set");
  process.exit(1);
}
const startServer = async () => {
  try {
    await pool.query("SELECT NOW()");

    console.log("Supabase PostgreSQL connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();