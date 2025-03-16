
import { Schema, model, models } from 'mongoose';

const PaymentMethodSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  card_number: {
    type: String,
    required: true,
  },
  cardholder_name: {
    type: String,
    required: true,
  },
  expiry_month: {
    type: String,
    required: true,
  },
  expiry_year: {
    type: String,
    required: true,
  },
  card_type: {
    type: String,
    required: true,
  },
  is_default: {
    type: Boolean,
    default: false,
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

export default models.PaymentMethod || model('PaymentMethod', PaymentMethodSchema);
