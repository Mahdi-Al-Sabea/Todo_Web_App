import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => ID ,{description: "Unique identifier for the user"})
  _id: string;

  @Field({description: "Name of the user"})
  name: string;

  @Field({description: "Email of the user"})
  email: string;

    // no need for password it will cause a security issue

}