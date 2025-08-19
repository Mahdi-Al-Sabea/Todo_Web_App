import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";

@ObjectType()
export class Todo {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field()
  completed!: boolean;

  // Not exposed to the GraphQL schema, used for internal linking
  userId!: string;

  @Field(() => User)
  user?: User; 
}