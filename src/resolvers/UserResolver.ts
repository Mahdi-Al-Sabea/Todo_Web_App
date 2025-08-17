import { Resolver,Query, Mutation, Arg, ID } from "type-graphql";
import { User } from "../entities/User";
import { SignUpInput } from "../entities/SignUpInput";
import { SignInInput } from "../entities/SignInInput";
import UserModel from "../models/UserModel"; 
import { signToken } from "../utils/auth";
import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";
@Resolver()
export class UserResolver {

/*     @Query(() => User, { nullable: true })
    async getUserTest(@Arg("id", () => ID) id: string) {
      return UserModel.findById(id).select("-password");
    } */


  @Mutation(() => User)
  async signup(@Arg("userdata") { email, password }: SignUpInput): Promise<User> {

        // Basic validation
    if (!email || !password) {
      throw new GraphQLError("Email and password are required.", {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
      });
    }

    // Check if user already exists
    if (await UserModel.findOne({ email })) {
      throw new GraphQLError("Email is already taken.", {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
      });
    }
    
    const newUser = new UserModel({
      email: email,
      password: password // Assuming password is already hashed in the model
    });
    
    await newUser.save();
    console.log("New user created:", newUser);
    return newUser as User; // Return the user as a TypeGraphQL User entity
  }



  @Mutation(() => String)
  async signin(@Arg("userdata") {email,password}: SignInInput): Promise<string> {
    // 1. Find the user in the database by their email
    const user = await UserModel.findOne({ email });

    // 2. If no user is found, throw an error
    if (!user) {
      throw new GraphQLError("Invalid email or password.", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }

    // 3. Use the .comparePassword() method from the User model
    const isMatch = await user.comparePassword(password);

    // 4. If the passwords don't match, throw the same error
    if (!isMatch) {
      throw new GraphQLError("Invalid email or password.", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }

    // 5. If passwords match, sign a JWT and return it
    const token = signToken({ email: user.email, id: user.id });

    return token;
  }
}