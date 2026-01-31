import { sendMail } from "../utils/sendMail.js";

// Send a notification email to a user
export const notifyUser = async ({ email, subject, message }) => {
  try {
    await sendMail({
      to: email,
      subject,
      text: message,
      html: `<p>${message}</p>`,
    });
    console.log(`Notification sent to ${email}`);
  } catch (error) {
    console.error("Notification failed:", error.message);
  }
};

// Send notification to admin
export const notifyAdmin = async ({ adminEmail, subject, message }) => {
  try {
    await sendMail({
      to: adminEmail,
      subject,
      text: message,
      html: `<p>${message}</p>`,
    });
    console.log(`Admin notified at ${adminEmail}`);
  } catch (error) {
    console.error("Admin notification failed:", error.message);
  }
};
