
import { Schema, model, models } from 'mongoose';

const ProductCategorySchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
});

export default models.ProductCategory || model('ProductCategory', ProductCategorySchema);
