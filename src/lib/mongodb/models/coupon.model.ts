
import { Schema, model, models } from 'mongoose';

const CouponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount_percentage: {
    type: Number,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  expires_at: {
    type: Date,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default models.Coupon || model('Coupon', CouponSchema);
