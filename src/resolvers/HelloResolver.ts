import { Resolver,Query, Authorized, Ctx } from "type-graphql";
import { User } from "../entities/User";
import { MyContext } from "../Context/MyContext";


@Resolver()
export  class HelloResolver {
  @Query(() => String)
  hello() {
    return "Hello World!";
  }
  
 @Authorized()
  @Query(() => String)
  me(@Ctx() { user }: MyContext) {
    if (!user) {
      throw new Error("User not found in context. This should not happen with @Authorized.");
    }
    return `Goodbye World! Your email is: ${user}`;
  }
}