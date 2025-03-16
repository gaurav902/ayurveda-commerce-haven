
import { Schema, model, models } from 'mongoose';

const WishlistSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default models.Wishlist || model('Wishlist', WishlistSchema);
