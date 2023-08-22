const nodeMailer = require("nodemailer");



exports.sendEmail=async(email,subject,payload)=>{
    console.log('Sending Email...');
    try{

        let transporter=nodeMailer.createTransport({
service:"gmail",
auth:{
    user:process.env.from,
    pass:process.env.pass,   
},
tls: {
    rejectUnauthorized: false, // Important! Allows using self-signed certificates
  },
 })

        let mailOptions={
            from:process.env.from,
            to:email,
            subject:subject,
            text:JSON.stringify(payload),     
        }
await transporter.sendMail(mailOptions,(er,data)=>{
    if(er){
        console.log(mailOptions)
        console.log("error in sendmail",er)
        return false
    }
    console.log("email was send succefully")
    return true
})

    }catch(er){
console.log("error while sending mail")
    }

}