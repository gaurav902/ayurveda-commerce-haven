
import { Schema, model, models } from 'mongoose';

const NewsletterSubscriberSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  receive_notifications: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default models.NewsletterSubscriber || model('NewsletterSubscriber', NewsletterSubscriberSchema);
