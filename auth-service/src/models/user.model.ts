import mongoose, { Schema, model, Document, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

export enum UserRole {
  ADMIN = 'admin201', // eslint-disable-line no-unused-vars
  USER = 'user202', // eslint-disable-line no-unused-vars
}
export interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  _id: mongoose.Types.ObjectId;
  isPasswordMatch(password: string): Promise<boolean>; // eslint-disable-line no-unused-vars
}

interface IUserModel extends Model<IUser> {
  isEmailRegistered(email: string): Promise<boolean>; // eslint-disable-line no-unused-vars
}

const userSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid Email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
          );
        }
      },
      private: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
      required: true,
    },
  },

  {
    toJSON: {
      transform(doc: IUser, ret: any) {
        delete ret.password;
        delete ret.__v;
      },
    },
    timestamps: true,
  },
);

// Static method to check if email is registered
userSchema.statics.isEmailRegistered = async function (email) {
  const user = await this.findOne({ email });
  return !!user;
};

// Index on email field for faster queries
userSchema.index({ email: 1 });

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// Instance method to check password match
userSchema.methods.isPasswordMatch = async function (password: string) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

const User = model<IUser, IUserModel>('User', userSchema);

export { User, IUserModel };
