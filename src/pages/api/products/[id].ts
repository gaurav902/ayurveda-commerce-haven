
import { supabase } from '@/integrations/supabase/client';
import { authenticateUser, requireAdmin } from '@/lib/api/middleware';

export default async function handler(req, res) {
  const { id } = req.query;
  
  switch (req.method) {
    case 'GET':
      try {
        const { data: product, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error || !product) {
          return res.status(404).json({ error: 'Product not found' });
        }
        
        return res.status(200).json(product);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch product' });
      }
    
    case 'PUT':
      try {
        await requireAdmin(req, res, async () => {
          const { name, description, price, stock, image_url } = req.body;
          
          const { data: updatedProduct, error } = await supabase
            .from('products')
            .update({
              name,
              description,
              price,
              stock,
              image_url,
              updated_at: new Date(),
            })
            .eq('id', id)
            .select()
            .single();
          
          if (error || !updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
          }
          
          return res.status(200).json(updatedProduct);
        });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to update product' });
      }
      break;
    
    case 'DELETE':
      try {
        await requireAdmin(req, res, async () => {
          const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);
          
          if (error) {
            return res.status(404).json({ error: 'Product not found' });
          }
          
          return res.status(200).json({ message: 'Product deleted successfully' });
        });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to delete product' });
      }
      break;
    
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
