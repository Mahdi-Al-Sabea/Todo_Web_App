import { AuthChecker } from "type-graphql";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel";
import { User } from "../entities/User";

export const customAuthChecker: AuthChecker<any> = async ({ context }) => {
 if (!context.user) return false;
 return true;
};

