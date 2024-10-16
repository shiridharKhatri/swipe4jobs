const adminAccess = require("../middleware/adminAccess");
const express = require("express");
const Postjob = require("../models/Postjob");
const routes = express.Router();

routes.post("/overview/:id", adminAccess, async (req, res) => {
  try {
    let jobs = await Postjob.find();
    if (!jobs) {
      return req
        .status(404)
        .json({ success: false, message: "Job postings not found" });
    }
    if (String(req.admin.id) !== String(req.params.id)) {
      return res
        .status(401)
        .json({ success: false, message: "Only admin can access overview" });
    }
    let positions = [];
    let pending = await Postjob.find({ isApproved: false });
    let approved = await Postjob.find({ isApproved: true });
    jobs.forEach((element) => {
      positions.push(...element.position);
    });

    const counts = {};
    positions.forEach((position) => {
      counts[position] = (counts[position] || 0) + 1;
    });

    let data = {
      pending: pending.length,
      approved: approved.length,
      total: pending.length + approved.length,
      overview: counts,
    };
    res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = routes;
