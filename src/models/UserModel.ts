import { model, Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { ITodo } from './TodoModel'; // Assuming Todo model is in the same directory

// Interface to define the properties for a User document (for TypeScript)
export interface IUser extends Document {
  email: string;
  password?: string; // Password is not always present (e.g., when fetching user data)
  todos?: ITodo['_id'][];
  comparePassword(password: string): Promise<boolean>;
}

// The actual Mongoose schema
const UserSchema: Schema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
}, {
  // Automatically add createdAt and updatedAt timestamps
  timestamps: true,
   toJSON: {
    transform: function (doc, ret) {
      delete ret._id;      // Delete the old '_id'
      delete ret.__v;      // Delete the version key
      delete ret.password; // In order to protect user privacy
    },
    virtuals: true, // Ensure virtuals like 'id' are included
  },
  toObject: {
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.__v;
      delete ret.password;
    },
    virtuals: true,
  },
});

// Middleware (pre-save hook) to hash the password before saving
UserSchema.pre<IUser>('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare a candidate password with the stored hashed password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default model<IUser>('User', UserSchema);