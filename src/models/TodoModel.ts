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
},{
  timestamps: true,
   toJSON: {
    transform: function (doc, ret) {
      //ret.id = ret._id;    // Remap '_id' to 'id'
      delete ret._id;      // Delete the old '_id'
      delete ret.__v;      // Delete the version key
    },
    virtuals: true, // Ensure virtuals like 'id' are included
  },
  toObject: {
    transform: function (doc, ret) {
      //ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
    virtuals: true,
  },
});

export default model<ITodo>('Todo', TodoSchema);

