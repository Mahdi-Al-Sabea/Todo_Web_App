import { ObjectType, Field, ID, InputType } from "type-graphql";
import { IsEmail, IsNotEmpty, Max, MaxLength, Min, MinLength, validate } from 'class-validator';


@InputType()
export class SignInInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  password!: string;

}