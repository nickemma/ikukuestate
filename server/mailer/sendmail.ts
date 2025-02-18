import nodemailer, { TransportOptions } from "nodemailer";
import { config } from "../config/app.config";

// Explicitly define the transport options
const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: Number(config.SMTP_PORT),
  secure: true,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASSWORD,
  },
} as TransportOptions);

export const sendMail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  try {
    await transporter.sendMail({
      from: config.SMTP_USER,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("Email failed:", error);
    throw error;
  }
};
