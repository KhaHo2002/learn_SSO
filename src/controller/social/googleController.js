require("dotenv").config();
import passport from "passport";
const GoogleStrategy = require('passport-google-oauth20').Strategy;
import loginRegisterService from '../../service/loginRegisterService';
import { v4 as uuidv4 } from 'uuid';

const loginWithGoogle = () => {

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_APP_CLIENT_ID,
        clientSecret: process.env.GOOGLE_APP_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_APP_REDIRECT_LOGIN
    },
        async function (accessToken, refreshToken, profile, cb) {
            const typeAcc = 'google';
            let data = {
                username: profile.displayName,
                email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : profile.id
            }
            let user = await loginRegisterService.upsertUserGoogleOrFacebook(typeAcc, data);
            user.code = uuidv4();
            return cb('', user);

            // User.findOrCreate({ googleId: profile.id }, function (err, user) {
            //     return cb(err, user);
            // });
        }
    ));
}

export default loginWithGoogle;