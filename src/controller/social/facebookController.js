

require("dotenv").config();
import passport from "passport";
const FacebookStrategy = require('passport-facebook').Strategy;
import loginRegisterService from '../../service/loginRegisterService';
import { v4 as uuidv4 } from 'uuid';

const loginWithFacebook = () => {

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_APP_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_APP_REDIRECT_LOGIN,
        profileFields: ['id', 'emails', 'name', 'displayName']
    },
        async function (accessToken, refreshToken, profile, cb) {
            const typeAcc = 'facebook';
            let data = {
                username: profile.displayName,
                email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : profile.id
            }
            let user = await loginRegisterService.upsertUserGoogleOrFacebook(typeAcc, data);
            user.code = uuidv4();
            return cb('', user);
        }
    ));
}

export default loginWithFacebook;