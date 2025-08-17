import jwt from "jsonwebtoken";
import 'dotenv/config';

export function signToken(user: { id: string; email: string }): string {
  return jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}