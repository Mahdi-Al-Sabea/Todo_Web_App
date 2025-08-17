import { ObjectType, Field, ID, InputType } from "type-graphql";

@InputType()
export class SignInInput {

  @Field()
  email!: string;

  @Field()
  password!: string;

}