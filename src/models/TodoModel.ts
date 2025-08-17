import { model, Schema, Document } from 'mongoose';

// Interface to define the properties for a Todo document (for TypeScript)
export interface ITodo extends Document {
  title: string;
  completed: boolean;
  userId: Schema.Types.ObjectId;
}

// The actual Mongoose schema
const TodoSchema: Schema = new Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export default model<ITodo>('Todo', TodoSchema);

