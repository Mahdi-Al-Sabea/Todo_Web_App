import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/HelloResolver";
import { connectDB } from "./config/mongo";


async function bootstrap() {

  await connectDB();

  const schema = await buildSchema({
    resolvers: [HelloResolver],
  });

  const server = new ApolloServer({ schema });
  const { url } = await startStandaloneServer(server, {listen: { port: 4000 }});
  console.log(`🚀 Server ready at ${url}`);
}

bootstrap(); 

