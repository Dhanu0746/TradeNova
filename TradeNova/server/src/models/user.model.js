import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  portfolio: {
    type: [
      {
        symbol: { type: String, required: true },
        shares: { type: Number, required: true, min: 0 },
        averagePrice: { type: Number, required: true, min: 0 }
      }
    ],
    default: []
  }
});

export const User = mongoose.model('User', userSchema);
