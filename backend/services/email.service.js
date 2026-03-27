import nodemailer from "nodemailer";

const getTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error("Email credentials missing: GMAIL_USER or GMAIL_APP_PASSWORD is not set in environment variables.");
  }
  
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    connectionTimeout: 10000, // 10 seconds to establish connection
    greetingTimeout: 10000,   // 10 seconds for greeting
    socketTimeout: 15000,     // 15 seconds for socket inactivity
  });
};

export const sendInterviewLink = async (toEmail, candidateName, jobTitle, interviewLink) => {
  console.log(`📧 Attempting to send interview link to: ${toEmail}`);
  const transporter = getTransporter();
  
  const mailOptions = {
    from: `"InterviewIQ Team" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `Interview Invitation for ${jobTitle} - InterviewIQ`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #6C63FF; margin: 0;">InterviewInvitation</h1>
        </div>
        <p style="font-size: 16px; color: #1e293b;">Hello <strong>${candidateName}</strong>,</p>
        <p style="font-size: 14px; color: #475569; line-height: 1.6;">
          You have been invited for an AI-powered interview for the position of <strong>${jobTitle}</strong>.
        </p>
        <div style="margin: 32px 0; text-align: center;">
          <a href="${interviewLink}" style="background: linear-gradient(135deg, #6C63FF 0%, #00D4FF 100%); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
            Start Interview
          </a>
        </div>
        <p style="font-size: 12px; color: #94a3b8; font-style: italic;">
          Note: This interview link is unique to you. Please do not share it.
        </p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">
          Powered by <strong>InterviewIQ</strong> - The Future of AI Recruitment
        </p>
      </div>
    `,
  };

  // Wrap sendMail in a timeout to prevent indefinite hanging
  const sendPromise = transporter.sendMail(mailOptions);
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Email sending timed out after 20 seconds")), 20000)
  );
  
  return Promise.race([sendPromise, timeoutPromise]);
};
