import jwt from 'jsonwebtoken';
import { User } from '../entities/User';

export function setToken(user: User) {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
}

export function getPayload(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}
