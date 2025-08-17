import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Authorized,
  ID,
  Root,
  FieldResolver,
} from "type-graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { GraphQLError } from "graphql";
import { Todo } from "../entities/Todo";
import { User } from "../entities/User";
import TodoModel from "../models/TodoModel";
import UserModel from "../models/UserModel";
import { MyContext } from "../Context/context";

@Resolver(Todo)
export class TodoResolver {
  @Authorized()
  @Query(() => [Todo])
  async myTodos(@Ctx() { user }: MyContext): Promise<Todo[]> {
    const todos = await TodoModel.find({ userId: user!.id });
    return todos.map((todo) => todo.toObject<Todo>());
  }

  @Authorized()
  @Mutation(() => Todo)
  async addTodo(
    @Arg("title") title: string,
    @Ctx() { user }: MyContext
  ): Promise<Todo> {
    if (!title) {
      throw new GraphQLError("Title is required.", {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
      });
    }
    const newTodo = new TodoModel({
      title,
      completed: false,
      userId: user!.id,
    });
    await newTodo.save();
    const todo = newTodo.toObject<Todo>(); // Convert Mongoose document to plain object
    return todo; // Return the new todo as a TypeGraphQL Todo entity
  }

  @Authorized()
  @Mutation(() => Todo)
  async toggleTodo(
    @Arg("id", () => ID) id: string,
    @Ctx() { user }: MyContext
  ): Promise<Todo> {
    const todo = await TodoModel.findById(id);

    console.log("Toggling todo:", todo);

    if (!todo) {
      throw new GraphQLError("Todo not found.", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    if (todo.userId.toString() !== user!.id) {
      throw new GraphQLError("You are not authorized to modify this todo.", {
        extensions: { code: "FORBIDDEN" },
      });
    }

    todo.completed = !todo.completed;
    await TodoModel.findByIdAndUpdate(id, todo);

    const todoObj = todo.toObject<Todo>();
    return todoObj;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deleteTodo(
    @Arg("id", () => ID) id: string,
    @Ctx() { user }: MyContext
  ): Promise<boolean> {
    const todo = await TodoModel.findById(id);

    if (!todo) {
      throw new GraphQLError("Todo not found.", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    if (todo.userId.toString() !== user!.id) {
      throw new GraphQLError("You are not authorized to delete this todo.", {
        extensions: { code: "FORBIDDEN" },
      });
    }

    await TodoModel.findByIdAndDelete(id);
    return true;
  }


  // Get the user who created the todo
  @FieldResolver()
  async user(@Root() todo: Todo): Promise<User | undefined> {
    const userDoc = await UserModel.findById(todo.userId);
    return userDoc ? userDoc.toObject<User>() : undefined;
  }
}
