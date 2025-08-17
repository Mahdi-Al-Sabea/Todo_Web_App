import { ObjectType, Field, ID } from "type-graphql";
import { Todo } from "./Todo";

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  // Not exposed to the GraphQL schema
  password!: string;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;

  @Field(() => [Todo])
  todos?: Todo[];
}
