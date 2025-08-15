import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./UserModel";

export interface ITask extends Document {
  description: string;
  assignedTo: IUser["_id"];
  completed: boolean;
}

const taskSchema = new Schema<ITask>({
  description: { type: String, required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
  completed: { type: Boolean, default: false },
});

export const TaskModel = mongoose.model<ITask>("Task", taskSchema);



