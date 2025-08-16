import { Resolver,Query, Mutation, Arg, ID } from "type-graphql";
import { User } from "../entities/User";
import { SignUpInput } from "../entities/SignUpInput";
import { SignInInput } from "../entities/SignInInput";
import { UserModel } from "../models/UserModel";
import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken";
import 'dotenv/config';


@Resolver()
export class UserResolver {

    @Query(() => User, { nullable: true })
    async getUserTest(@Arg("id", () => ID) id: string) {
      return UserModel.findById(id).select("-password");
    }


  @Mutation(() => User)
  async signup(@Arg("userdata") userData: SignUpInput){
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = new UserModel({
      name: userData.name,
      email: userData.email,
      password: hashedPassword
    });
    
    await newUser.save();
    return newUser;
  }



  @Mutation(() => String)
  async signin(@Arg("userdata") userData: SignInInput): Promise<string> {
    const user = await UserModel.findOne({ email: userData.email });
    if (!user) throw new Error("User not found");

    const token = jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const isValid = await bcrypt.compare(userData.password, user.password);
    if (!isValid) throw new Error("Invalid email or password");

    return token;
  }
}