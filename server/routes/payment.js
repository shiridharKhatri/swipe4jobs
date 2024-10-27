const express = require("express");
const Payment = require("../models/Payment");
const Stripe = require("stripe");
const userAccess = require("../middleware/userAccess");
const User = require("../models/User");
const adminAccess = require("../middleware/adminAccess");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const routes = express.Router();
const PDFDocument = require("pdfkit");
routes.post("/buy/search/limit/:type", userAccess, async (req, res) => {
  let user = await User.findById(req.user.id);
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "User not found with given id" });
  }

  const { qty } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Additional search limit (${qty})`,
          },
          unit_amount: 55,
        },
        quantity: qty,
      },
    ],
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/status/success`,
    cancel_url: `${process.env.FRONTEND_URL}/status/failed`,
    payment_intent_data: {
      description: "Payment for Additional Search Limit",
      metadata: {
        userId: req.user.id,
        serviceType: req.params.type,
        quantity: qty,
      },
    },
    metadata: {
      userId: req.user.id,
      serviceType: req.params.type,
      quantity: qty,
    },
  });
  res.status(200).json({ id: session.id });
});

routes.post(
  "/webhook",
  express.json({ type: "application/json" }),
  async (req, res) => {
    const event = req.body;
    if (event.type === "checkout.session.completed") {
      let metaDataObj = event.data.object.metadata;
      let user = await User.findById(metaDataObj.userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found with given id" });
      }
      const quantity = Number(metaDataObj.quantity);
      if (isNaN(quantity)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid quantity value" });
      }

      await User.findByIdAndUpdate(
        metaDataObj.userId,
        {
          $set: {
            search_limit: user.search_limit + Number(quantity),
          },
        },
        { new: true }
      );
      await Payment.create({
        userId: metaDataObj.userId,
        payment_id: `${user.name.trim().split(" ")[0][0].toUpperCase()}_${
          Math.floor(Math.random() * 90000000) + 10000000
        }`,
        transactionId: event.data.object.id,
        amount: event.data.object.amount_total / 100,
        paymentStatus: event.data.object.status,
        serviceType: metaDataObj.serviceType,
        search_limit: metaDataObj.quantity,
        remarks:
          metaDataObj.serviceType === "search"
            ? `Purhcased search limit of ${metaDataObj.quantity} qty`
            : "",
      });

      return res
        .status(200)
        .json({ success: true, message: "Purchase successfully" });
    }
  }
);

routes.post("/details/fetch/:id", adminAccess, async (req, res) => {
  try {
    let adminId = req.admin.id;
    let { id } = req.params;
    if (String(adminId) !== String(id)) {
      return res.status(401).json({
        success: false,
        message: "You don't have access to see payment",
      });
    }
    let payment = await Payment.find();
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "No payment records has been found" });
    }
    let data = [];
    for (const elems of payment) {
      let user = await User.findById(elems.userId);
      if (user) {
        data.push({
          id: elems.id,
          userId: user.id,
          name: user.name,
          email: user.email,
          paymentId: elems.id,
          transId: elems.transactionId,
          paymentMethod: elems.paymentMethod,
          amount: elems.amount,
          currency: elems.currency,
          paymentStatus: elems.paymentStatus,
          serviceType: elems.serviceType,
          search_limit: elems.search_limit,
          remarks: elems.remarks,
          paymentDate: elems.paymentDate,
        });
      }
    }
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, type: "server", message: error.message });
  }
});

routes.get("/details/bill/download/:id", adminAccess, async (req, res) => {
  const user = {
    _id: "12345",
    name: "John Doe",
    email: "john.doe@example.com",
  };

  const elems = {
    _id: "payment_67890",
    transactionId: "txn_123456",
    paymentMethod: "Credit Card",
    amount: "100.00",
    currency: "USD",
    paymentStatus: "Completed",
    serviceType: "Monthly Subscription",
    description: "Monthly Subscription Fee for Premium Service",
    paymentDate: new Date().toLocaleDateString(),
  };

  const doc = new PDFDocument();

  res.setHeader("Content-disposition", "attachment; filename=receipt.pdf");
  res.setHeader("Content-type", "application/pdf");
  doc.pipe(res);

  doc.rect(0, 0, doc.page.width, 150).fill("#007ACC");
  doc
    .fillColor("#FFFFFF")
    .fontSize(30)
    .text("Payment Receipt", { align: "center", baseline: "middle" });

  doc.moveDown(2);

  doc
    .fillColor("#333333")
    .fontSize(14)
    .text("User Details", { underline: true });
  doc.moveDown(0.5);
  doc.fillColor("#555555").fontSize(12).text(`Name: ${user.name}`);
  doc.text(`Email: ${user.email}`);
  doc.moveDown(1);

  doc
    .fillColor("#333333")
    .fontSize(14)
    .text("Payment Details", { underline: true });
  doc.moveDown(0.5);
  doc
    .fillColor("#555555")
    .text(`Payment ID: ${elems._id}`)
    .text(`Transaction ID: ${elems.transactionId}`)
    .text(`Payment Method: ${elems.paymentMethod}`)
    .text(`Amount: ${elems.currency} ${elems.amount}`)
    .text(`Status: ${elems.paymentStatus}`)
    .text(`Service Type: ${elems.serviceType}`)
    .text(`Description: ${elems.description}`)
    .text(`Payment Date: ${elems.paymentDate}`);

  doc.moveDown(1.5);

  doc
    .fillColor("#007ACC")
    .fontSize(16)
    .text("Thank you for your payment!", { align: "center" });
  doc.moveDown(0.5);

  doc
    .fillColor("#999999")
    .fontSize(10)
    .text(
      "This receipt is generated automatically and does not require a signature.",
      { align: "center" }
    );

  doc.end();
});

routes.get("/details/history/:id", userAccess, async (req, res) => {
  try {
    const { id } = req.params;
    if (String(id) !== String(req.user.id)) {
      return res
        .status(401)
        .json({ success: false, message: "Id doesn't match" });
    }
    let paymentDetails = await Payment.find({ userId: req.user.id });
    if (!paymentDetails) {
      return res
        .status(404)
        .json({ success: false, message: "No payment has been made till now" });
    }
    res.status(200).json({ success: true, data: paymentDetails });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
module.exports = routes;
