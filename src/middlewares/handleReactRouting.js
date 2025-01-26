import express from "express";
import path from "path";

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// Catch-all middleware to handle React routes
const handleReactRouting = (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
};

app.get("*", handleReactRouting);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
