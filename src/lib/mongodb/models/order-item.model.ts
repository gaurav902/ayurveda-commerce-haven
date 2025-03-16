
import { Schema, model, models } from 'mongoose';

const OrderItemSchema = new Schema({
  order_id: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    default: null,
  },
  product_name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default models.OrderItem || model('OrderItem', OrderItemSchema);
