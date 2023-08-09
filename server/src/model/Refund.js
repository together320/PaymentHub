import mongoose from "mongoose";

const RefundSchema = new mongoose.Schema(
  {
    merchantId: String,
    transactionId: String,
    referenceId: String,
    refundType: String,
    orderId: String,
    card: String,
    amount: Number,
    currency: String,
    status: String,
    response: String,
    statusDate: Date,
},
  { timestamps: true }
);

const Refund = mongoose.model("Refund", RefundSchema);
export default Refund;
