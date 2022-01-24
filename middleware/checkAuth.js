const checkAuth = (req,res,next) =>{
    let username = req.cookies.username;
    if(!username){
        res.redirect('/login');
    }
    req.username = username;
    next();
}

module.exports = checkAuth;