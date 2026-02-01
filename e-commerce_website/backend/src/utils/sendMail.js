import nodemailer from "nodemailer";

export const sendMail = async ({ to, subject, text, html }) => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.error("Email configuration missing (EMAIL_USER or EMAIL_PASS)");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: user,
        pass: pass.replace(/\s/g, ""), // Automatically remove spaces
      },
    });

    const mailOptions = {
      from: user,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[SUCCESS] Email sent to ${to}`);
  } catch (error) {
    console.error("[ERROR] Email sending failed!");
    console.error("Error Message:", error.message);
    if (error.code === 'EAUTH') {
      console.error("Authentication failed. Please check your EMAIL_USER and App Password.");
    }
  }
};
