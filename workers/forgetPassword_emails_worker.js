const queue = require('../config/kue');
const forgetPasswordMailer = require('../mailers/forgetPasswordMailer');

// forgetten password mail
queue.process('forgetPasswordEmail', (job, done) => {
    console.log('forgetPasswordEmail worker is processing a job ', job.data);
    forgetPasswordMailer.forgetPassword(job.data);
    done();
});