import { ObjectType, Field, ID, InputType } from "type-graphql";

@InputType()
export class SignUpInput {

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

}