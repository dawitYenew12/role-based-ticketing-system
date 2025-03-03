import { User } from '../models/user.model';
import logger from '../config/logger';
import { getChannel } from '../config/rabbitmq';

interface RegisterUserResponse {
  success: boolean;
  message: string;
  userId?: string;
}

const registerUser = async (
  email: string,
  password: string,
): Promise<RegisterUserResponse> => {
  try {
    // Check if email is already registered
    if (await User.isEmailRegistered(email)) {
      return { success: false, message: 'Email already registered' };
    }

    // Create new user
    const user = new User({ email, password });
    await user.save();

    // Send user-created event to RabbitMQ
    const channel = getChannel();
    if (channel) {
      channel.sendToQueue(
        'user-created',
        Buffer.from(
          JSON.stringify({
            userId: user._id,
            email: user.email,
            role: user.role,
          }),
        ),
      );
    }

    logger.info(`User registered: ${user.email}`);
    return {
      success: true,
      message: 'User registered successfully',
      userId: user._id.toString(),
    };
  } catch (error: any) {
    logger.error(`Error registering user: ${error.message}`);
    throw new Error('Failed to register user');
  }
};

const authenticateUser = async (
  email: string,
  password: string,
): Promise<{ success: boolean; message: string; token?: string }> => {
  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user || !(await user.isPasswordMatch(password))) {
      return { success: false, message: 'Invalid credentials' };
    }

    // Generate token (you can use JWT or another library)
    const token = 'generate-your-token-here';

    logger.info(`User logged in: ${email}`);
    return { success: true, message: 'Login successful', token };
  } catch (error: any) {
    logger.error(`Authentication error: ${error.message}`);
    throw new Error(`Failed to authenticate user: ${error.message}`);
  }
};

export default { registerUser, authenticateUser };
