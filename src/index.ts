import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";
import { connectDB } from "./config/mongo";
import { HelloResolver } from "./resolvers/HelloResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { customAuthChecker } from "./utils/customAuthChecker";
import { context } from "./Context/context";
import { TodoResolver } from "./resolvers/TodoResolver";


async function bootstrap() {

  await connectDB();

  const schema = await buildSchema({
    resolvers: [HelloResolver, UserResolver, TodoResolver],
    authChecker: customAuthChecker,
    validate: true // use class-validator
  });

  const server = new ApolloServer({ schema });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: context //this attached user to the context 
  });
  console.log(`🚀 Server ready at ${url}`);
}

bootstrap(); 

