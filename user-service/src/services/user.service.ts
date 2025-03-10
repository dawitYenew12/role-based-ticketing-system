import { UserRole } from '../models/userProfile.model';
import UserProfile from '../models/userProfile.model';
import logger from '../config/logger';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

const createUserProfile = async (
  userId: string,
  email: string,
  role: string,
): Promise<void> => {
  try {
    const userProfile = new UserProfile({ userId, email, role });
    await userProfile.save();
    logger.info(`User profile created for: ${email}`);
  } catch (error) {
    logger.error(`Error creating user profile: ${(error as Error).message}`);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create user profile',
    );
  }
};

const getUserProfile = async (
  userId: string,
  requestingUserId: string,
  userRole: string,
) => {
  if (userId !== requestingUserId && userRole !== UserRole.ADMIN) {
    logger.warn(
      `Unauthorized access attempt to user ${userId} from user ${requestingUserId}`,
    );
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  const userProfile = await UserProfile.findOne({ userId });
  if (!userProfile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  logger.info(`User profile retrieved for: ${userId}`);
  return userProfile;
};

const getAllUsers = async (userRole: string) => {
  try {
    if (userRole !== UserRole.ADMIN) {
      logger.warn(`Unauthorized access attempt to retrieve all users`);
      throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
    }
    const users = await UserProfile.find();
    logger.info('All users retrieved by admin');
    return users;
  } catch (error: any) {
    throw new Error(`Error retrieving all users: ${error.message}`);
  }
};

export default { getUserProfile, getAllUsers, createUserProfile };
