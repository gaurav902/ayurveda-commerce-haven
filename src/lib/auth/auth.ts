
import { sign, verify } from 'jsonwebtoken';
import { supabase } from '@/integrations/supabase/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = '7d';

export async function signUp(email: string, password: string, userData: any = {}) {
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

export async function signIn(email: string, password: string) {
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

export async function getCurrentUser(token: string) {
  try {
    if (!token) return null;
    
    // Verify token
    const decoded = verifyToken(token);
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
