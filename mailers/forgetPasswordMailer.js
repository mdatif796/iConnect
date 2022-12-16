const nodemailer = require('../config/nodemailer');

exports.forgetPassword = async (token) => {
    let htmlString = nodemailer.renderTemplate({token: token}, '/comment/forgetPassword.ejs');
    nodemailer.transporter.sendMail({
        from: 'recovery@iconnect.com',
        to: token.userId.email,
        subject: 'Forget Password!',
        html: htmlString
    }, (err, info) => {
        if(err){console.log('error in mailing,', err); return;}
        console.log('Message sent', info);
        return;
    });
}