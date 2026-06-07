import jwt from "jsonwebtoken";
import { config } from "../config.js";

export const protect = (req, res, next) => {
  console.log("AUTH HEADER:", req.headers.authorization); // ✅ inside

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    req.user = decoded; // { id: userId }
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};