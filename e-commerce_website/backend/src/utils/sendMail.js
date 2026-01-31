import nodemailer from "nodemailer";

export const sendMail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or any SMTP service
      auth: {
        user: process.env.EMAIL_USER, // set in .env
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
};
