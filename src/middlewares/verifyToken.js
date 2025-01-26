import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization; // Get the Authorization header

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const token = authHeader.split(" ")[1]; // Extract the token

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verify and decode the token
    req.user = decoded; // Attach the decoded payload to the request
    next(); // Proceed to the next middleware
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token expired. Please log in again." });
    }
    return res.status(403).json({ message: "Invalid token." });
  }
};

export default verifyToken;
