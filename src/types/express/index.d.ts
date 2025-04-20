// src/types/express/index.d.ts
import { User } from "../../entities/User";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      user?: User;
      followingIds?: number[];
    }
  }
}
