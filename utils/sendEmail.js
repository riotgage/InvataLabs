const nodemailer = require("nodemailer");

const sendEmail=async(options)=> {
 
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL, 
      pass: process.env.SMTP_PASSWORD, 
    },
  });

  // send mail with defined transport object
  let msg = await transporter.sendMail({
    from:`${process.env.FROM_NAME}<${process.env.FROM_EMAIL}>`, 
    to: options.email,
    subject:options.subject,
    text: options.message,
    
  });
  console.log("Message sent: %s", msg.messageId);
}

module.exports =sendEmail
