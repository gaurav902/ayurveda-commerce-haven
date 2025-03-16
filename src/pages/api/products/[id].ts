
import connectToDatabase from '@/lib/mongodb/connect';
import Product from '@/lib/mongodb/models/product.model';
import ProductCategory from '@/lib/mongodb/models/product-category.model';
import { verifyToken } from '@/lib/auth/auth';

export default async function handler(req, res) {
  const { id } = req.query;
  
  await connectToDatabase();

  switch (req.method) {
    case 'GET':
      try {
        const product = await Product.findById(id);
        
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
        
        res.status(200).json(product);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'PUT':
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

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
          id,
          {
            name,
            description,
            price: price * 100, // Convert to cents
            stock,
            image_url,
            updated_at: new Date()
          },
          { new: true }
        );

        if (!updatedProduct) {
          return res.status(404).json({ error: 'Product not found' });
        }

        // Update product-category relationship if category is provided
        if (category) {
          // Remove existing relationship
          await ProductCategory.deleteMany({ product_id: id });
          
          // Create new relationship
          const productCategory = new ProductCategory({
            product_id: id,
            category_id: category
          });
          
          await productCategory.save();
        }

        res.status(200).json(updatedProduct);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'DELETE':
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

        // Delete product
        const deletedProduct = await Product.findByIdAndDelete(id);
        
        if (!deletedProduct) {
          return res.status(404).json({ error: 'Product not found' });
        }
        
        // Delete product-category relationships
        await ProductCategory.deleteMany({ product_id: id });
        
        res.status(200).json({ message: 'Product deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
