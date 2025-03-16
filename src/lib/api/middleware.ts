
import { verifyJWTToken } from '@/lib/auth/auth';
import { supabase } from '@/integrations/supabase/client';

export async function authenticateUser(req: any, res: any, next: any) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const decoded = verifyJWTToken(token) as { userId: string } | null;
    
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Get user from Supabase
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', decoded.userId)
      .single();
    
    if (error || !user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Get user email from auth
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      return res.status(401).json({ error: 'User not found in auth' });
    }
    
    req.user = {
      id: user.id,
      email: authUser.email || '',
      is_admin: user.is_admin,
    };
    
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

export async function requireAdmin(req: any, res: any, next: any) {
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
