
import { sign, verify } from 'jsonwebtoken';
import User from '../mongodb/models/user.model';
import connectToDatabase from '../mongodb/connect';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = '7d';

export async function signUp(email: string, password: string, userData: any = {}) {
  try {
    await connectToDatabase();
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Create user
    const user = new User({
      email,
      password,
      full_name: userData.full_name || '',
      ...userData
    });
    
    await user.save();
    
    // Generate token
    const token = generateToken(user._id.toString());
    
    return {
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        is_admin: user.is_admin,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
      },
      token,
    };
  } catch (error) {
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    await connectToDatabase();
    
    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }
    
    // Generate token
    const token = generateToken(user._id.toString());
    
    return {
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        is_admin: user.is_admin,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
      },
      token,
    };
  } catch (error) {
    throw error;
  }
}

export async function getCurrentUser(token: string) {
  try {
    if (!token) return null;
    
    await connectToDatabase();
    
    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) return null;
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) return null;
    
    return {
      id: user._id,
      email: user.email,
      full_name: user.full_name,
      is_admin: user.is_admin,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      pincode: user.pincode,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  } catch (error) {
    return null;
  }
}

export function generateToken(userId: string) {
  return sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string) {
  try {
    return verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
}
