import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// interface AuthenticatedRequest extends Request {
//   userId?: number;
// }

// export const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Unauthorized: No token provided' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
//     req.userId = decoded.id;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Unauthorized: Invalid token' });
//   }
// };


interface AuthenticatedRequest extends Request {
  userId?: number;
}

export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userIdHeader = req.headers['x-user-id'];

  if (!userIdHeader) {
    return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
  }

  const userId = parseInt(userIdHeader as string, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID format' });
  }

  req.userId = userId;
  next();
};

