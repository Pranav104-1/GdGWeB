import { auth } from "../models/auth.models.js";
import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  let token = req.cookies?.token;
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await auth.findById(decoded.userId);
    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid token user" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid or expired token" });
  }
};
