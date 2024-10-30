const nodemailer = require("nodemailer");

const verificationMail = async (email, name, code, subject, details) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `Swipe 4 Jobs <${process.env.EMAIL}>`,
      to: email,
      subject: subject,
      text: "Your Submission Has Been Rejected",
      html: ``,
    });

    console.log("Message sent: %s", info);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = verificationMail;
