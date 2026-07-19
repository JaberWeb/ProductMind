import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000,
});

router.post("/contact", async (req: any, res: any) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const db = req.app.locals.db;
    await db.collection("contacts").insertOne({
      name,
      email,
      subject,
      message,
      createdAt: new Date(),
    });

    try {
      const contactEmail = process.env.CONTACT_EMAIL || "hello@productmind.ai";
      await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: contactEmail,
        subject: `[Contact Form] ${subject}`,
        text: `From: ${name} (${email})\n\nSubject: ${subject}\n\nMessage:\n${message}`,
        html: `<p><strong>From:</strong> ${name} (${email})</p>
               <p><strong>Subject:</strong> ${subject}</p>
               <p><strong>Message:</strong></p>
               <p>${message.replace(/\n/g, "<br>")}</p>`,
      });
    } catch (emailErr) {
      console.warn("Failed to send email notification:", emailErr);
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error("Contact form error:", err);
    res.status(500).json({ error: err.message || "Failed to submit contact form" });
  }
});

export default router;
