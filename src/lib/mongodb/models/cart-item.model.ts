
import { Schema, model, models } from 'mongoose';

const CartItemSchema = new Schema({
  cart_id: {
    type: Schema.Types.ObjectId,
    ref: 'Cart',
    required: true,
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

export default models.CartItem || model('CartItem', CartItemSchema);
