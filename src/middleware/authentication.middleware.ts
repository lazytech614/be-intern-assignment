import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { User } from "../entities/User";

interface JwtPayload {
  userId: number;
}

// Read your secret from env (never hard‑code in production)  
const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_prod";  

export async function validateAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 1. Extract Bearer token  
  const authHeader = req.header("Authorization");  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {  
    return res.status(401).json({ error: "No token, authorization denied" });  
  }  
  const token = authHeader.replace("Bearer ", "");  

  try {
    // 2. Verify and decode token  
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;  
    req.userId = decoded.userId;  
  } catch (err) {
    return res.status(401).json({ error: "Token is not valid" });  
  }

  try {
    // 3. Load user and their followings from DB  
    const repo = getRepository(User);  
    const user = await repo.findOne({
      where: { id: req.userId! },
      relations: ["followings"]
    });  

    if (!user) {  
      return res.status(401).json({ error: "User not found" });  
    }  

    // 4. Attach user and followingIds array  
    req.user = user;  
    req.followingIds = user.followings.map(u => u.id);  
    next();  

  } catch (dbErr) {
    console.error("Auth middleware DB error:", dbErr);  
    return res.status(500).json({ error: "Server error" });  
  }
}
