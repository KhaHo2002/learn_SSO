
import passport from 'passport';
import LocalStrategy from 'passport-local';
import loginRegisterService from '../service/loginRegisterService';


const configPassPort = () => {
    // passport.use(new LocalStrategy(async function verify(username, password, cb) {
    //     const rawData = {
    //         valueLogin: username,
    //         password: password
    //     }

    //     let res = await loginRegisterService.handleUserLogin(rawData);
    //     if (res && res.errorCode === 0) {
    //         return cb(null, res.data);
    //     }
    //     else {
    //         return cb(null, false, { message: res.status });
    //     }
    // }));

    passport.use(new LocalStrategy({
        passReqToCallback: true
    },
        async (req, username, password, done) => {
            const rawData = {
                valueLogin: username,
                password: password
            }
            let res = await loginRegisterService.handleUserLogin(rawData);
            if (res && res.errorCode === 0) {
                return done(null, res.data);
            }
            else {
                return done(null, false, { message: res.status });
            }
        }
    ))

}

const handleLogout = (req, res, next) => {
    req.session.destroy(function (err) {
        req.logout();
        res.redirect('/');
    })
}

module.exports = {
    configPassPort, handleLogout
}