
import { verifyToken } from '@/lib/auth/auth';
import User from '@/lib/mongodb/models/user.model';
import connectToDatabase from '@/lib/mongodb/connect';

export async function authenticateUser(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    await connectToDatabase();
    
    // Fix: Use model.findById() with proper callback/promise handling
    try {
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      
      req.user = {
        id: user._id,
        email: user.email,
        is_admin: user.is_admin,
      };
      
      return next();
    } catch (err) {
      console.error('User lookup error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

export async function requireAdmin(req, res, next) {
  try {
    await authenticateUser(req, res, () => {
      if (!req.user.is_admin) {
        return res.status(403).json({ error: 'Forbidden - Admin access required' });
      }
      
      return next();
    });
  } catch (error) {
    return res.status(403).json({ error: 'Admin authentication failed' });
  }
}
