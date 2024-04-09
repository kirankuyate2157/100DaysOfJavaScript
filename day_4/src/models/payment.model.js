import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["razorpay", "stripe"],
      default: "razorpay",
    },
    paymentSubType: {
      type: String,
      enum: ["card", "UPI", "paypal", "credit"],
      default: "card",
    },
    relatedPay: {
      type: String,
      required: true,
    },
    relatedId: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
