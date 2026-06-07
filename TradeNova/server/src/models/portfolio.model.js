import mongoose from "mongoose";

const holdingSchema = new mongoose.Schema({
  symbol: String,
  quantity: Number,
  avgPrice: Number
});

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  balance: {
    type: Number,
    default: 10000
  },
  holdings: [holdingSchema]
});

export default mongoose.model("Portfolio", portfolioSchema);