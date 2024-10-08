const mongoose = require("mongoose");
const moment = require("moment");
const paymentSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user-details",
    require: true,
  },
  transactionId: {
    type: String,
    require: true,
  },
  paymentMethod: {
    type: String,
    enum: ["stripe"],
    default: "stripe",
  },
  amount: {
    type: Number,
    require: true,
  },
  currency: {
    type: String,
    default: "USD",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  serviceType: {
    type: String,
    enum: ["job_posting", "search", "subscription", "other"],
    require: true,
  },
  search_limit: {
    type: Number,
    require: () => {
      this.serviceType === "search";
    },
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post-details",
    require: () => {
      this.serviceType === "job_posting";
    },
  },
  description: {
    type: String,
  },
  paymentDate: {
    type: String,
    default: moment().format("MMMM Do YYYY, h:mm:ss a"),
  },
});
module.exports = mongoose.model("payment-details", paymentSchema);
