require('dotenv').config();
import db from '../models/index';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { getGroupWithRoles } from './JWTService';
import { createJWT } from '../middleware/JWTAction';
import { v4 as uuidv4 } from 'uuid';

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (userPassword) => {
    let hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword;
}

const checkEmailExist = async (userEmail) => {
    let user = await db.User.findOne({
        where: { email: userEmail }
    })

    if (user) {
        return true;
    }
    return false;
}

const checkPhoneExist = async (userPhone) => {
    let user = await db.User.findOne({
        where: { phone: userPhone }
    })

    if (user) {
        return true;
    }
    return false;
}

const registerNewUser = async (rawUserData) => {
    try {
        //check email/phonenumber are exist
        let isEmailExist = await checkEmailExist(rawUserData.email);
        if (isEmailExist === true) {
            return {
                status: 'The email is already exist',
                errorCode: 1
            }
        }
        let isPhoneExist = await checkPhoneExist(rawUserData.phone);
        if (isPhoneExist === true) {
            return {
                status: 'The phone number is already exist',
                errorCode: 1
            }
        }
        //hash user password
        let hashPassword = hashUserPassword(rawUserData.password);

        //create new user
        await db.User.create({
            email: rawUserData.email,
            username: rawUserData.username,
            password: hashPassword,
            phone: rawUserData.phone,
            groupId: 4
        })

        return {
            status: 'A user is created successfully!',
            errorCode: '0'
        }

    } catch (e) {
        console.log(e)
        return {
            status: 'Somthing wrongs in service...',
            errorCode: -2
        }
    }
}

const checkPassword = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword); // true or false
}

const handleUserLogin = async (rawData) => {
    try {
        let user = await db.User.findOne({
            where: {
                [Op.or]: [
                    { email: rawData.valueLogin },
                    { phone: rawData.valueLogin }
                ]
            }
        })

        if (user) {
            let isCorrectPassword = checkPassword(rawData.password, user.password);
            if (isCorrectPassword === true) {
                const code = uuidv4();
                let groupWithRoles = await getGroupWithRoles(user);
                // let payload = {
                //     email: user.email,
                //     groupWithRoles,
                //     username: user.username
                // }
                // let token = createJWT(payload);
                return {
                    status: 'ok!',
                    errorCode: 0,
                    data: {
                        code: code,
                        groupWithRoles: groupWithRoles,
                        email: user.email,
                        username: user.username
                    }
                }
            }
        }

        return {
            status: 'Your email/phone number or password is incorrect!',
            errorCode: 1,
            data: ''
        }


    } catch (error) {
        console.log(error)
        return {
            status: 'Somthing wrongs in service...',
            errorCode: -2
        }
    }
}

const updateUserRefreshToken = async (email, token) => {
    // return;
    try {
        let user = await db.User.update(
            { refreshToken: token },
            { where: { email: email } }
        )
    } catch (error) {
        throw error;
    }
}

const upsertUserGoogleOrFacebook = async (typeAcc, data) => {
    try {
        let user = await db.User.findOne({
            where: {
                email: data.email,
                typelogin: typeAcc
            },
            raw: true
        });
        if (!user) {
            await db.User.create({
                username: data.username,
                email: data.email,
                typelogin: typeAcc
            })
        }
        else {
            return user;
        }
    } catch (error) {
        return {
            status: 'Somthing wrongs in service...',
            errorCode: -2
        }
    }
}

module.exports = {
    registerNewUser, handleUserLogin, hashUserPassword, checkEmailExist, checkPhoneExist, updateUserRefreshToken, upsertUserGoogleOrFacebook
}