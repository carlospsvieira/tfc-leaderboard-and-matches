import { Request, Response, NextFunction } from 'express';
import { VerifyErrors, verify } from 'jsonwebtoken';

interface DecodedUser {
  id: string;
  role: string;
}

interface CustomRequest extends Request {
  user?: DecodedUser;
}

export const validateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }

  verify(token, 'jwt_secret', (err: VerifyErrors | null, decoded: object | undefined) => {
    if (err) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }
    req.user = decoded as DecodedUser;

    next();
  });
};

export const getRole = (req: CustomRequest, res: Response) => {
  const { role } = req.user!;

  res.status(200).json({ role });
};
