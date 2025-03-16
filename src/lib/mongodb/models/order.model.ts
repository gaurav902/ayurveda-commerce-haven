
import { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  total_amount: {
    type: Number,
    required: true,
  },
  discount_amount: {
    type: Number,
    default: 0,
  },
  coupon_id: {
    type: Schema.Types.ObjectId,
    ref: 'Coupon',
    default: null,
  },
  shipping_address: {
    type: String,
    required: true,
  },
  shipping_city: {
    type: String,
    required: true,
  },
  shipping_state: {
    type: String,
    required: true,
  },
  shipping_pincode: {
    type: String,
    required: true,
  },
  shipping_phone: {
    type: String,
    required: true,
  },
  order_notes: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  payment_method: {
    type: String,
    required: true,
  },
  payment_status: {
    type: String,
    default: 'pending',
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

export default models.Order || model('Order', OrderSchema);
