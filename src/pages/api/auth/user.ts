
import { getCurrentUser } from '@/lib/auth/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const user = await getCurrentUser(token);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
