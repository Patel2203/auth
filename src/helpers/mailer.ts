import User from '@/models/userModel';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'

export const sendEmail= async({email, emailType, userId}:any)=>{
    try {

      const hashedToken = await bcryptjs.hash(userId.toString(),10)

      if (emailType === "VERIFY") {
        await User.findByIdAndUpdate(userId,
          {verifyToken: hashedToken, verifyTokenExpiry:Date.now() + 3600000})
      }else if(emailType === "RESET"){

        await User.findByIdAndUpdate(userId,
          {forgotPasswordToken: hashedToken, forgotPasswordExpires:Date.now() + 3600000})
      }

      var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "4e05c8ef82b9fc",
          pass: "e2f78d123e2f50"
        }
      });

          const mailOptions = {
            from: 'hitest@hitesh.ai',
            to: email, 
            subject:emailType === 'VERIFY' ? "Verify your email": "Reset your password", 
            html: `<p>Click <a href = "${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset ypur password"}
            or copy and paste the link below in your browser.<br>${process.env.DOMAIN}/verifyemail?Token=${hashedToken}</p>`, 
          }

         const mailResponse =  await transport.sendMail(mailOptions)
         return mailResponse
    } catch (error:any) {
        throw new Error(error.message)
    }
}