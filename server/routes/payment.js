const express = require("express");
const Payment = require("../models/Payment");
const Stripe = require("stripe");
const userAccess = require("../middleware/userAccess");
const User = require("../models/User");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const routes = express.Router();
routes.post("/buy/search/limit", userAccess, async (req, res) => {
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
          unit_amount: 22,
        },
        quantity: qty,
      },
    ],

    mode: "payment",
    success_url: "http://localhost:5173/status/success",
    cancel_url: "http://localhost:5173/status/failed",
    payment_intent_data: {
      description: "Payment for Additional Search Limit",
      metadata: {
        business_name: "Swipe 4 Jobs",
      },
    },
  });

  res.status(200).json({ id: session.id });
});
module.exports = routes;
