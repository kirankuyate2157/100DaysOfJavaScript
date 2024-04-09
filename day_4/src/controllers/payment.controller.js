import axios from "axios";
import crypto from "crypto";
import Razorpay from "razorpay";
import { Payment } from "../models/payment.model.js";

const makePayment = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });
    if (!amount || !currency) {
      throw new ApiError(500, "amount or currency not specified 🫠");
    }
    const order = await razorpayInstance.orders.create({
      amount: parseInt(amount * 100),
      currency,
    });
    return res
      .status(200)
      .json(new ApiResponse(201, order, "payment done successfully ✅"));
  } catch (error) {
    throw new ApiError(
      500,
      `something went wrong while payment 🫠 ${error.message} `
    );
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      paymentId,
      paymentType,
      paymentSubType,
      relatedPay,
      relatedId,
      signature,
    } = req.body;

    if (!paymentId || !relatedId) {
      throw new ApiError(500, "paymentId or pay relatedId id required 🫠");
    }
    if (!relatedPay) {
      throw new ApiError(
        500,
        "which related `relatedPay`  payment done ? required 🫠"
      );
    }

    const sign = paymentId + "_" + relatedId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(sign.toString())
      .digest("hex");

    if (signature === expectedSignature) {
      const payment = await Payment.create({
        paymentId,
        paymentType,
        paymentSubType,
        relatedPay,
        relatedId,
        signature,
        status: "success",
      });

      return res
        .status(200)
        .json(
          new ApiResponse(201, payment, "payment verified successfully ✅")
        );
    } else {
      const payment = await Payment.create({
        paymentId,
        paymentType,
        paymentSubType,
        relatedPay,
        relatedId,
        signature,
        status: "fail",
      });

      throw new ApiError(400, "Invalid signature sent! 🫠");
    }
  } catch (error) {
    throw new ApiError(
      500,
      `something went wrong while payment 🫠 ${error.message} `
    );
  }
};

export { verifyPayment, makePayment };
