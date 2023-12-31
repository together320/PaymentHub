import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    merchantId: String,
    transactionType: String,
    paymentMethod: String,
    transactionId: String,
    orderId: String,
    orderDetail: String,
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    clientIp: String,
    email: String,
    phone: String,
    amount: Number,
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP"],
      default: "USD",
    },
    cardType: String,
    cardNumber: String,
    cardCVV: String,
    cardExpMonth: String,
    cardExpYear: String,
    redirectUrl: String,
    callbackUrl: String,
    session: String,
    hash: String,
    paymentId: String,
    status: {
      type: String,
      enum: ["pending", "approved", "declined", "cancelled", "error"],
      default: "pending",
    },
    response: String,
    statusDate: Date,
    mode: {
      type: String,
      enum: ["test", "live"],
      default: "test",
    },
},
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
