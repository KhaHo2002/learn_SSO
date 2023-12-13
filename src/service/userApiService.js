import db from '../models/index';
import { checkEmailExist, checkPhoneExist, hashUserPassword } from './loginRegisterService';

const getAllUser = async () => {
    try {
        let users = await db.User.findAll({
            attributes: ["id", "username", "email", "phone", "sex"],
            include: { model: db.Group, attributes: ["name", "description"] },
        });
        if (users) {
            return {
                status: 'get data success',
                errorCode: 0,
                data: users
            }
        } else {
            return {
                status: 'get data success',
                errorCode: 0,
                data: []
            }
        }

    } catch (e) {
        console.log(e);
        return {
            status: 'something wrongs with servies',
            errorCode: 1,
            data: []
        }
    }
}

const getUserWithPagination = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;

        const { count, rows } = await db.User.findAndCountAll({
            offset: offset,
            limit: limit,
            attributes: ["id", "username", "email", "phone", "sex", "address"],
            include: { model: db.Group, attributes: ["name", "description", "id"] },
            order: [['id', 'DESC']]
        })

        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            users: rows
        }

        return {
            status: 'fetch ok',
            errorCode: 0,
            data: data
        }

    } catch (e) {
        console.log(e);
        return {
            status: 'something wrongs with servies',
            errorCode: 1,
            data: []
        }
    }
}

const createNewUser = async (data) => {
    try {
        //check email, phone number
        let isEmailExist = await checkEmailExist(data.email);
        if (isEmailExist === true) {
            return {
                status: 'The email is already exist',
                errorCode: 1,
                data: 'email'
            }
        }
        let isPhoneExist = await checkPhoneExist(data.phone);
        if (isPhoneExist === true) {
            return {
                status: 'The phone number is already exist',
                errorCode: 1,
                data: 'phone'
            }
        }
        //hash user password
        let hashPassword = hashUserPassword(data.password);

        //hash user password
        await db.User.create({ ...data, password: hashPassword });
        return {
            status: 'create ok',
            errorCode: 0,
            data: []
        }
    } catch (e) {
        console.log(e);
        return {
            status: 'something wrongs with servies',
            errorCode: 1,
            data: []
        }
    }
}

const updateUser = async (data) => {
    try {
        if (!data.groupId) {
            return {
                status: 'Error with empty GroupId',
                errorCode: 1,
                data: 'group'
            }
        }
        let user = await db.User.findOne({
            where: { id: data.id }
        })

        if (user) {
            //update
            await user.update({
                username: data.username,
                address: data.address,
                sex: data.sex,
                groupId: data.groupId
            })

            return {
                status: 'Update user succeeds',
                errorCode: 0,
                data: ''
            }
        } else {
            //not found
            return {
                status: 'User not found',
                errorCode: 2,
                data: ''
            }
        }
    } catch (e) {
        console.log(e);
        return {
            status: 'something wrongs with servies',
            errorCode: 1,
            data: []
        }
    }
}

const deleteUser = async (id) => {
    try {
        let user = await db.User.findOne({
            where: { id: id }
        })
        if (user) {
            await user.destroy();
            return {
                status: 'Delete user succeeds',
                errorCode: 0,
                data: []
            }
        } else {
            return {
                status: 'User not exist',
                errorCode: 2,
                data: []
            }
        }

    } catch (e) {
        console.log(e);
        return {
            status: 'error from service',
            errorCode: 1,
            data: []
        }

    }
}

module.exports = {
    getAllUser, createNewUser, updateUser, deleteUser, getUserWithPagination
}