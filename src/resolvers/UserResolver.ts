import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ID,
  Root,
  FieldResolver,
  Ctx,
  Authorized,
} from "type-graphql";
import { User } from "../entities/User";
import { Todo } from "../entities/Todo";
import { SignUpInput } from "../entities/SignUpInput";
import { SignInInput } from "../entities/SignInInput";
import UserModel from "../models/UserModel";
import { signToken } from "../utils/auth";
import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import TodoModel from "../models/TodoModel";
import { MyContext } from "../Context/context";
@Resolver(User)
export class UserResolver {

/* @Mutation(() => SignInInput)
createSignInInput(
  @Arg("data") data: SignInInput
) {
  const signInInput: SignInInput = {
    email: data.email,
    password: data.password,
  };
  return signInInput;
} */

  @Authorized()
  @Query(() => User)
  async getMyUser(@Ctx() { user }: MyContext): Promise<User> {
    // Get user by his id (stored in token)
    const userDoc = await UserModel.findById(user!.id);
    return userDoc ? userDoc.toObject<User>() : undefined;
  }


  @Mutation(() => User)
  async signup(
    @Arg("userdata") { email, password }: SignUpInput
  ): Promise<User> {
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
      password: password, // Password is hashed before saving in db (configured in UserModel)
    });

    await newUser.save();
    console.log("New user created:", newUser);
    return newUser as User; // Return the user as a TypeGraphQL User entity
  }

  @Mutation(() => String)
  async signin(
    @Arg("userdata") { email, password }: SignInInput
  ): Promise<string> {
    //  Find the user in the database by their email
    const user = await UserModel.findOne({ email });

    // If no user is found, throw an error
    if (!user) {
      throw new GraphQLError("Invalid email or password.", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }

    // Use the .comparePassword() method from the User model
    const isMatch = await user.comparePassword(password);

    // If the passwords don't match, throw the same error
    if (!isMatch) {
      throw new GraphQLError("Invalid email or password.", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }

    // If passwords match, sign a JWT and return it
    const token = signToken({ email: user.email, id: user.id });

    return token;
  }

  // Get all todos for a user
  @FieldResolver(() => [Todo])
  async todos(@Root() user: User): Promise<Todo[]> {
    const todos = await TodoModel.find({ userId: user!.id });
    return todos.map((todo) => todo.toObject<Todo>());
  }

}
