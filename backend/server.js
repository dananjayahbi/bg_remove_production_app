const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const os = require("os");
const cors = require("cors");
const User = require("./models/user.model");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("./assets/Outputs"));

const upload = multer({ dest: "./assets/Uploads/" });

const pythonCommand = os.platform() === "win32" ? "python" : "python3";
// const pythonScriptPath = path.join(__dirname, "./remove_bg.py");

app.get("/", (req, res) => {
  res.send({ message: "Hello World!" }); 
});

app.use("/api/users", require("./routes/user.route"));

app.post("/api/bgRemove/upload", upload.array("images", 10), (req, res) => {
  const files = req.files;
  const id = uuidv4();
  const uploadDir = path.join(__dirname, "./assets/Uploads", id);
  const outputDir = path.join(__dirname, "./assets/Outputs", id);

  fs.mkdirSync(uploadDir, { recursive: true });
  fs.mkdirSync(outputDir, { recursive: true });

  const renamedFiles = files.map((file) => {
    const fileExtension = path.extname(file.originalname);
    const newFilename = `${uuidv4()}${fileExtension}`;
    const newFilePath = path.join(uploadDir, newFilename);

    fs.renameSync(file.path, newFilePath);

    return newFilename;
  });

  const command = `${pythonCommand} remove_bg.py "${uploadDir}" "${outputDir}"`;

  exec(command, async (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send("Error processing images");
    }

    console.log(stdout);

    const fileUrls = renamedFiles.map((file) => `http://localhost:${PORT}/${id}/${path.basename(file, path.extname(file))}.png`);

    try {
      const userId = req.body.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send("User not found");
      }

      user.gallery = [...user.gallery, ...fileUrls.map(url => ({ url }))];
      await user.save();

      // res.json({ id, files: renamedFiles, fileUrls });
    } catch (err) {
      res.status(500).send("Error updating user gallery");
    }
    res.json({ id, files: renamedFiles });
  });
});

app.get("/api/bgRemove/status/:id", (req, res) => {
  const id = req.params.id;
  const outputDir = path.join(__dirname, "./assets/Outputs", id);

  fs.readdir(outputDir, (err, files) => {
    if (err || files.length === 0) {
      return res.json({ status: "processing" });
    }

    res.json({ status: "completed", files });
  });
});

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