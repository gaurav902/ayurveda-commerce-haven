
import { supabase } from '@/integrations/supabase/client';
import { authenticateUser, requireAdmin } from '@/lib/api/middleware';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const { data: products, error } = await supabase
          .from('products')
          .select('*');
        
        if (error) {
          return res.status(500).json({ error: 'Failed to fetch products' });
        }
        
        return res.status(200).json(products);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch products' });
      }
    
    case 'POST':
      try {
        await requireAdmin(req, res, async () => {
          const { name, description, price, stock, image_url } = req.body;
          
          const { data: newProduct, error } = await supabase
            .from('products')
            .insert({
              name,
              description,
              price,
              stock,
              image_url,
              created_at: new Date(),
              updated_at: new Date(),
            })
            .select()
            .single();
          
          if (error) {
            return res.status(400).json({ error: 'Failed to create product' });
          }
          
          return res.status(201).json(newProduct);
        });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to create product' });
      }
      break;
    
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
