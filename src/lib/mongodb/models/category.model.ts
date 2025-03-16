
import { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
  },
  description: {
    type: String,
    default: '',
  },
  image_url: {
    type: String,
    default: '',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default models.Category || model('Category', CategorySchema);
