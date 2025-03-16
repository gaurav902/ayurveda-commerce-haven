
import Product from '@/lib/mongodb/models/product.model';
import connectToDatabase from '@/lib/mongodb/connect';
import { requireAdmin } from '@/lib/api/middleware';

export default async function handler(req, res) {
  await connectToDatabase();
  
  switch (req.method) {
    case 'GET':
      try {
        const products = await Product.find().lean().exec();
        
        return res.status(200).json(products.map(product => ({
          id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          image_url: product.image_url,
          created_at: product.created_at,
          updated_at: product.updated_at,
        })));
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch products' });
      }
    
    case 'POST':
      try {
        await requireAdmin(req, res, async () => {
          const { name, description, price, stock, image_url } = req.body;
          
          const product = new Product({
            name,
            description,
            price,
            stock,
            image_url,
          });
          
          await product.save();
          
          return res.status(201).json({
            id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            image_url: product.image_url,
            created_at: product.created_at,
            updated_at: product.updated_at,
          });
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
