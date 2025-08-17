import { StandaloneServerContextFunctionArgument } from "@apollo/server/dist/esm/standalone";
import { User } from "../entities/User"; // Your simple TypeGraphQL User class
import { verifyToken } from "../utils/auth";
import UserModel, { IUser } from "../models/UserModel"; // Your Mongoose model

export interface MyContext {
  // We expect a plain User object, or undefined
  user?: User;
}

export async function context({
  req,
}: StandaloneServerContextFunctionArgument): Promise<MyContext> {
  const authorization = req.headers.authorization;

    console.log("Authorization header:", authorization);

  if (authorization && authorization.startsWith("Bearer ")) {
    console.log("Authorization header is valid.");
    const token = authorization.split(" ")[1];
    const payload = verifyToken(token);
    console.log("Decoded payload:", payload);
    
    if (payload) {
      // 1. Fetch the full Mongoose document
      const userDoc = await UserModel.findById(payload.userId);

      if (userDoc) {
        // 2. Convert the document to a plain object before returning
        const user = userDoc.toObject();
        console.log("User found:", user);
        return { user: user as User };
      }
    }
  }

  return { user: undefined };
}