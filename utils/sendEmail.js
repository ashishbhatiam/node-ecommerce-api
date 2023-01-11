const nodemailer = require('nodemailer')
const sgMail = require('@sendgrid/mail')

const createLocalStmp = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_LOCAL_INFO_HOST,
    port: process.env.SMTP_LOCAL_INFO_PORT,
    auth: {
      user: process.env.SMTP_LOCAL_INFO_AUTH_USER,
      pass: process.env.SMTP_LOCAL_INFO_AUTH_PASSWORD
    }
  })

  return transporter
}

const createCloudStmp = () => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  return sgMail
}

const sendEmailLocal = async (toUsers, subject, msg) => {
  const transporter = createLocalStmp()
  const info = transporter.sendMail({
    from: `"Node Email Sender" <${process.env.SMTP_LOCAL_INFO_AUTH_USER}>`, // Authorized Sender Email
    to: toUsers, // Recipient Email
    subject: subject, // Subject line
    text: msg.replace(/<[^>]*>/g, '') || msg.replace(/<[^>]*>/g, '') || '', // plain text body
    html: msg // html body
  })
  return info
}

const sendEmail = async (toUsers, subject, msg) => {
  const sgMail = createCloudStmp()

  const sgMsg = {
    to: toUsers, // Recipient Email
    from: process.env.SMTP_CLOUD_SENDER, // Authorized Sender Email
    subject: subject, // Subject line
    text: msg.replace(/<[^>]*>/g, '') || msg.replace(/<[^>]*>/g, '') || '', // plain text body
    html: msg // html body
  }

  const info = sgMail.send(sgMsg)
  return info
}

module.exports = {
  createLocalStmp,
  createCloudStmp,
  sendEmailLocal,
  sendEmail
}
