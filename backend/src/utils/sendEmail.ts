import sgMail from "@sendgrid/mail";

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string,
) => {
  if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
    throw new Error("SendGrid API Key or From Email is missing from environment variables.");
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email sent to ${to}`);
  } catch (error: any) {
    console.error("❌ SendGrid Email Error:");
    if (error.response) {
      console.error(JSON.stringify(error.response.body, null, 2));
    } else {
      console.error(error);
    }
    // THROW the error so authController knows the email failed to send!
    throw new Error("Failed to send verification email via SendGrid.");
  }
};