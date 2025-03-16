
import jwt from 'jsonwebtoken';
import { supabase } from '@/integrations/supabase/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = '7d';

// Client-safe JWT verification that works in both Node.js and browser
export function verifyJWTToken(token) {
  try {
    // In browser environment, we'll use a simpler approach
    if (typeof window !== 'undefined') {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      const now = Date.now() / 1000;
      
      if (payload.exp && payload.exp < now) {
        return null;
      }
      
      return payload;
    } 
    // In Node.js environment, use the proper jwt.verify
    else {
      return jwt.verify(token, JWT_SECRET);
    }
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

// Only used on the server side
export function generateToken(userId) {
  if (typeof window === 'undefined') {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }
  // For browser safety, return empty string
  return '';
}

export async function signUp(email, password, userData = {}) {
  try {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) throw new Error(authError.message);
    
    // Update profile with additional data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: userData.full_name || '',
        phone: userData.phone || null,
        address: userData.address || null,
        city: userData.city || null,
        state: userData.state || null,
        pincode: userData.pincode || null,
      })
      .eq('id', authData.user.id);
    
    if (profileError) throw new Error(profileError.message);
    
    // Generate token
    const token = generateToken(authData.user.id);
    
    // Get the updated profile
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    if (userError) throw new Error(userError.message);
    
    return {
      user: {
        id: user.id,
        email: authData.user.email,
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

export async function signIn(email, password) {
  try {
    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (authError) throw new Error(authError.message);
    
    // Get user profile
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    if (userError) throw new Error(userError.message);
    
    // Generate token
    const token = generateToken(authData.user.id);
    
    return {
      user: {
        id: user.id,
        email: authData.user.email,
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

export async function getCurrentUser(token) {
  try {
    if (!token) return null;
    
    // Verify token
    const decoded = verifyJWTToken(token);
    if (!decoded) return null;
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) return null;
    
    // Get user profile
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', decoded.userId)
      .single();
    
    if (userError || !user) return null;
    
    return {
      id: user.id,
      email: session.user.email,
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

// Export a renamed version of verify for compatibility
export function verifyToken(token) {
  return verifyJWTToken(token);
}
