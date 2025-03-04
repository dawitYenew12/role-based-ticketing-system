import mongoose, { Document, Schema } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin201', // eslint-disable-line no-unused-vars
  USER = 'user202', // eslint-disable-line no-unused-vars
}

export interface IUserProfile extends Document {
  userId: string;
  email: string;
  role: string;
  createdAt: Date;
}

const userProfileSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: Object.values(UserRole), default: 'User' },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IUserProfile>('UserProfile', userProfileSchema);
