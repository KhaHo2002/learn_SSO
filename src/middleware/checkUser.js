
const isLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.path === '/login') {
            return res.redirect("/");
        }
        next();
    } else {
        if (req.path === '/login') {
            return next();
        }
        return res.redirect("/login");
    }
};

module.exports = { isLogin }