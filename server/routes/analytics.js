const adminAccess = require("../middleware/adminAccess");
const Analytics = require("../models/Analytics");
const express = require("express");
const Postjob = require("../models/Postjob");
const routes = express.Router();
routes.get("/overview", adminAccess, async (req, res) => {
  try {
    const fetchPost = await Postjob.find();
    let approvedPost = 0;
    let pendingPost = 0;
    let positions = [];
    if (fetchPost.length > 0) {
      Array.from(fetchPost).forEach((jobs) => {
        if (jobs.isApproved === true) {
          approvedPost++;
        } else {
          pendingPost++;
        }
        positions.push(...jobs.position);
      });
    }

    return res.status(200).json({
      success: true,
      approved: approvedPost,
      pending: pendingPost,
      total: approvedPost + pendingPost,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, type: "server", message: error.message });
  }
});
module.exports = routes;
