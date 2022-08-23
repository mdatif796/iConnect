module.exports.user = function(req, res){
    res.render('user', {
        title: "user"
    });
}


module.exports.profile = function(req, res){
    res.end('<h1> User profile </h1>');
}
