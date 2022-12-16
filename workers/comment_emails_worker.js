const queue = require('../config/kue');
const commentMailer = require('../mailers/commentMailers');

queue.process('emails', (job, done) => {
    console.log('emails worker is processing a job ', job.data);
    commentMailer.newComment(job.data);
    done();
});