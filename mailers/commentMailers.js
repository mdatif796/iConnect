const nodeMailer = require('../config/nodemailer');


exports.newComment = (comment) => {
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comment/new_comment.ejs');
    nodeMailer.transporter.sendMail({
        from: 'tempemail796@gmail.com',
        to: comment.user.email,
        subject: 'New comment published!',
        html: htmlString
    }, (err, info) => {
        if(err){console.log('error in mailing,', err); return;}
        console.log('Message sent', info);
        return;
    });
}