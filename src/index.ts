import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";
import { connectDB } from "./config/mongo";
import { HelloResolver } from "./resolvers/HelloResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { customAuthChecker } from "./utils/customAuthChecker";
import { MyContext } from "./Context/MyContext";
import jwt from "jsonwebtoken";
import { UserModel } from "./models/UserModel";


async function bootstrap() {

  await connectDB();

  const schema = await buildSchema({
    resolvers: [HelloResolver,UserResolver],
    authChecker: customAuthChecker
  });

  const server = new ApolloServer({ schema });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
     context: async ({ req, res }): Promise<MyContext> => {

      const context: MyContext = { req, res };
      
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        if (token) {
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
            // Populate the user on the context if a valid token exists
            context.user = await UserModel.findById(decoded.id).select("-password");
          } catch (error) {
            console.error("Token verification failed:", error);
          }
        }
      }
      
      return context;
    },
    });
  console.log(`🚀 Server ready at ${url}`);
}

bootstrap(); 

