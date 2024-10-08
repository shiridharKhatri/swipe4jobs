const mongoose = require("mongoose");
const moment = require("moment");
const analyticsSchema = mongoose.Schema({
  totalPending: {
    type: String,
    require: true,
  },
  totalApproved: {
    type: String,
    require: true,
  },
  positionGraph: {
    type: [String],
    require: true,
  },
  updatedDate: {
    type: String,
    default: moment().format("MMMM Do YYYY, h:mm:ss a"),
  },
});
module.exports = mongoose.model("analytics-details", analyticsSchema);
