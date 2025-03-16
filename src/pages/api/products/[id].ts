
import Product from '@/lib/mongodb/models/product.model';
import connectToDatabase from '@/lib/mongodb/connect';
import { authenticateUser, requireAdmin } from '@/lib/api/middleware';

export default async function handler(req, res) {
  const { id } = req.query;
  
  await connectToDatabase();
  
  switch (req.method) {
    case 'GET':
      try {
        const product = await Product.findById(id).lean();
        
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
        
        return res.status(200).json({
          id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          image_url: product.image_url,
          created_at: product.created_at,
          updated_at: product.updated_at,
        });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch product' });
      }
    
    case 'PUT':
      try {
        await requireAdmin(req, res, async () => {
          const { name, description, price, stock, image_url } = req.body;
          
          const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
              name,
              description,
              price,
              stock,
              image_url,
              updated_at: new Date(),
            },
            { new: true }
          );
          
          if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
          }
          
          return res.status(200).json({
            id: updatedProduct._id,
            name: updatedProduct.name,
            description: updatedProduct.description,
            price: updatedProduct.price,
            stock: updatedProduct.stock,
            image_url: updatedProduct.image_url,
            created_at: updatedProduct.created_at,
            updated_at: updatedProduct.updated_at,
          });
        });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to update product' });
      }
      break;
    
    case 'DELETE':
      try {
        await requireAdmin(req, res, async () => {
          const deletedProduct = await Product.findByIdAndDelete(id);
          
          if (!deletedProduct) {
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
