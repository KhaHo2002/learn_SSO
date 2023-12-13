import { v4 as uuidv4 } from 'uuid';
import { createJWT } from '../middleware/JWTAction';
import 'dotenv/config';
import loginRegisterService from '../service/loginRegisterService';
const getLoginPage = (req, res) => {
    const { serviceURL } = req.query;
    return res.render("login.ejs", { redirectURL: serviceURL })
}

const handleVerifyToken = async (req, res) => {
    try {

        //validate domains

        //return jwt, refersh token
        const ssoToken = req.body.ssoToken;
        if (req.user && req.user.code && req.user.code === ssoToken) {
            const refreshToken = uuidv4();
            //update token of user
            let data = await loginRegisterService.updateUserRefreshToken(req.user.email, refreshToken);

            // create access token

            let payload = {
                email: req.user.email,
                groupWithRoles: req.user.groupWithRoles,
                username: req.user.username
            }

            //set cookie
            let token = createJWT(payload);

            // res.cookie('access_token', token, { maxAge: +process.env.MAX_AGE_ACCESS_TOKEN, httpOnly: true });
            res.cookie('access_token', token, { maxAge: 20 * 1000, httpOnly: true });
            // res.cookie('refresh_token', refreshToken, { maxAge: +process.env.MAX_AGE_REFRESH_TOKEN, httpOnly: true });
            res.cookie('refresh_token', refreshToken, { maxAge: 30 * 1000, httpOnly: true });


            let resData = {
                access_token: token,
                refresh_token: refreshToken,
                email: req.user.email,
                groupWithRoles: req.user.groupWithRoles,
                username: req.user.username
            }
            //destroy session
            req.session.destroy(function (err) {
                req.logout();
            });
            return res.status(200).json({
                errorCode: 0,
                status: 'ok',
                data: resData
            })
        }
        else {
            return res.status(401).json({
                errorCode: 1,
                status: 'not found',
                data: {}
            })
        }
    } catch (error) {
        return res.status(500).json({
            errorCode: 500,
            status: 'some wrong server',
            data: {}
        })
    }
}

module.exports = { getLoginPage, handleVerifyToken }