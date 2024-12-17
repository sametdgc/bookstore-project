import { emailTemp } from "./emailTemp.js";
import { RESEND_API_KEY } from "./resendApi.js";

import express from "express";
import bodyParser from "body-parser";
import { Resend } from "resend";
import cors from "cors";

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());

// CORS Configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Allow requests from your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
  })
);

// Initialize Resend
const resend = new Resend(RESEND_API_KEY);

// Email Sending Endpoint
app.post("/api/send-invoice-email", async (req, res) => {
  const { email, orderId, orderDetails } = req.body;

  console.log("Incoming Request Data:", req.body); // Log incoming request data for debugging

  if (!email || !orderId || !orderDetails) {
    return res.status(400).json({ error: "Missing email, order ID, or order details." });
  }

  try {
    // Generate the PDF for the invoice
    const pdfContent = emailTemp(orderDetails);
    const base64PDF = Buffer.from(pdfContent).toString("base64");

    const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2 style="color: #007BFF;">Thank you for your order!</h2>
      <p>Dear ${orderDetails.users.full_name},</p>
      <p>We appreciate your business and are excited to provide your order details. Please find your invoice attached to this email.</p>
      <p><strong>Order Number:</strong> ${orderId}</p>
      <p><strong>Total Amount:</strong> $${orderDetails.total_price.toFixed(2)} (VAT included)</p>
      <hr style="border: 1px solid #ddd; margin: 20px 0;">
      <p>If you have any questions or concerns, feel free to contact us at <a href="mailto:support@baranozcan.com">support@baranozcan.com</a>.</p>
      <p>Best regards,</p>
      <p>The Chapter Zero Team</p>
      <footer style="margin-top: 20px; font-size: 0.9em; color: #555;">
        <p>ChapterZero | 13 University St, Istanbul, Turkey</p>
        <p><a href="https://baranozcan.com">www.baranozcan.com</a> | <a href="mailto:support@baranozcan.com">support@baranozcan.com</a></p>
      </footer>
    </div>
  `;
  
    const emailResponse = await resend.emails.send({
        from: "Baran Ozcan <chZero@baranozcan.com>",
        to: email,
        subject: `Invoice for Order #${orderId}`,
        html: emailHtml,
        attachments: [
        {
            filename: `invoice-${orderId}.pdf`,
            content: base64PDF,
            type: "application/pdf",
            disposition: "attachment",
        },
        ],
    });
  

    console.log("Resend API Response:", emailResponse); // Log Resend response for debugging
    res.status(200).json({ message: "Email sent successfully!", emailResponse });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email.", details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
