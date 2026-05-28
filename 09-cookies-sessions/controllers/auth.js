exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('cookie').split('=')[1];
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'loggedIn=true ; httpOnly');  //this is how you can set the cookie and httpOnly make this cookie safe so no one can edit the cookie value from the browser side 
    // now let's see how session works 
    req.session.isLoggedIn = true ;
    res.redirect('/');
};