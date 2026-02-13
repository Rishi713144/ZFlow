import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: process.env.SMTP_ENDPOINT,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail(to: string, subject: string, body: string) {
  await transport.sendMail({
    from: process.env.SMTP_FROM_EMAIL || "noreply@zflow-app.com",
    to,
    subject,
    text: body
  })
}
