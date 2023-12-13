import loginRegisterService from '../service/loginRegisterService';
require("dotenv").config();

const testApi = (req, res) => {
    return res.status(200).json({
        message: 'ok',
        data: 'test api'
    })
}

const handleRegister = async (req, res) => {
    try {
        //req.body:  email, phone, username, password
        if (!req.body.email || !req.body.phone || !req.body.password) {
            return res.status(200).json({
                status: 'Missing required parameters', // error message
                errorCode: '1', //error code
                data: '', //date
            })
        }
        if (req.body.password && req.body.password.length < 4) {
            return res.status(200).json({
                status: 'Your password must have more than 3 letters', // error message
                errorCode: '1', //error code
                data: '', //date
            })
        }

        //service: create user
        let data = await loginRegisterService.registerNewUser(req.body)

        return res.status(200).json({
            status: data.status,
            status: data.errorCode, //error code
            data: '', //date
        })

    } catch (e) {
        return res.status(500).json({
            status: 'error from server', // error message
            errorCode: '-1', //error code
            data: '', //date
        })
    }
}

const handleLogin = async (req, res) => {
    try {

        let data = await loginRegisterService.handleUserLogin(req.body);
        //set cookie
        if (data && data.data && data.data.access_token) {
            res.cookie("jwt", data.data.access_token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
        }

        return res.status(200).json({
            status: data.status, // error message
            errorCode: data.errorCode, //error code
            data: data.data, //data
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 'error from server', // error message
            errorCode: '-1', //error code
            data: '', //date
        })
    }
}

const handleLogout = (req, res) => {
    try {
        res.clearCookie("access_token", { domain: process.env.COOKIE_DOMAIN, path: '/' });
        res.clearCookie("refresh_token", { domain: process.env.COOKIE_DOMAIN, path: '/' });
        return res.status(200).json({
            status: 'clear cookies done!', // error message
            errorCode: 0, //error code
            data: {}, //data
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 'error from server', // error message
            errorCode: '-1', //error code
            data: '', //date
        })
    }
}

module.exports = {
    testApi, handleRegister, handleLogin, handleLogout
}