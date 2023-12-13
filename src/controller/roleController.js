import userApiService from '../service/userApiService';
import roleApiService from '../service/roleApiService';

const readFunc = async (req, res) => {
    try {

        let data = await roleApiService.getAllRoles();
        return res.status(200).json({
            status: data.status, // error message
            errorCode: data.errorCode, //error code
            data: data.data, //data
        })

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
        let data = await roleApiService.createNewRoles(req.body);
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
//todo
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
        let data = await roleApiService.deleteRole(req.body.id);
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

const getRoleByGroup = async (req, res) => {
    try {
        let id = req.params.groupId;
        let data = await roleApiService.getRoleByGroup(id);
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

const assignRoleToGroup = async (req, res) => {
    try {
        let data = await roleApiService.assignRoleToGroup(req.body.data);
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
module.exports = {
    readFunc, createFunc, updateFunc, deleteFunc, getRoleByGroup, assignRoleToGroup
}