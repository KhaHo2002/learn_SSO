import userApiService from '../service/userApiService';

const readFunc = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;
            let data = await userApiService.getUserWithPagination(+page, +limit);
            return res.status(200).json({
                status: data.status, // error message
                errorCode: data.errorCode, //error code
                data: data.data, //data
            })
        } else {
            let data = await userApiService.getAllUser();
            return res.status(200).json({
                status: data.status, // error message
                errorCode: data.errorCode, //error code
                data: data.data, //data
            })
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 'error from server', // error message
            errorCode: '-1', //error code
            data: '', //date
        })
    }
}
const createFunc = async (req, res) => {
    try {
        //validate
        let data = await userApiService.createNewUser(req.body);
        return res.status(200).json({
            status: data.status, // error message
            errorCode: data.errorCode, //error code
            data: data.data, //data
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error from server', // error message
            errorCode: '-1', //error code
            data: '', //date
        })
    }
}
const updateFunc = async (req, res) => {
    try {
        //validate
        let data = await userApiService.updateUser(req.body);
        return res.status(200).json({
            status: data.status, // error message
            errorCode: data.errorCode, //error code
            data: data.data, //data
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error from server', // error message
            errorCode: '-1', //error code
            data: '', //date
        })
    }
}
const deleteFunc = async (req, res) => {
    try {
        let data = await userApiService.deleteUser(req.body.id);
        return res.status(200).json({
            status: data.status, // error message
            errorCode: data.errorCode, //error code
            data: data.data, //data
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error from server', // error message
            errorCode: '-1', //error code
            data: '', //date
        })
    }
}

const getUserAccount = async (req, res) => {
    return res.status(200).json({
        status: 'ok', // error message
        errorCode: 0, //error code
        data: {
            access_token: req.user.access_token,
            refresh_token: req.user.refresh_token,
            groupWithRoles: req.user.groupWithRoles,
            email: req.user.email,
            username: req.user.username
        }
    })
}
module.exports = {
    readFunc, createFunc, updateFunc, deleteFunc, getUserAccount
}