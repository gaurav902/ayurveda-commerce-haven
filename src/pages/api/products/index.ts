
import connectToDatabase from '@/lib/mongodb/connect';
import Product from '@/lib/mongodb/models/product.model';
import ProductCategory from '@/lib/mongodb/models/product-category.model';
import Category from '@/lib/mongodb/models/category.model';
import { verifyToken } from '@/lib/auth/auth';

export default async function handler(req, res) {
  await connectToDatabase();

  switch (req.method) {
    case 'GET':
      try {
        const products = await Product.find().sort({ created_at: -1 });
        res.status(200).json(products);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'POST':
      try {
        // Check if user is authenticated and is admin
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
          return res.status(401).json({ error: 'Invalid token' });
        }

        const { name, description, price, stock, image_url, category } = req.body;

        // Create product
        const product = new Product({
          name,
          description, 
          price: price * 100, // Convert to cents
          stock,
          image_url
        });

        await product.save();

        // Create product-category relationship if category is provided
        if (category) {
          const productCategory = new ProductCategory({
            product_id: product._id,
            category_id: category
          });
          
          await productCategory.save();
        }

        res.status(201).json(product);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
