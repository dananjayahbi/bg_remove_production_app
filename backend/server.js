const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("Outputs"));

app.get("/", (req, res) => {
  res.send({ message: "Hello World!" }); 
});

app.use("/api/users", require("./routes/user.route"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Setting up the database connection
const URL = process.env.MONGODB_URL;

if (!URL) {
  console.error("MongoDB connection URL is missing in the environment variables.");
  process.exit(1);
}

mongoose.set("strictQuery", true);
mongoose.connect(URL, { useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB connection established successfully!");
});