import groupService from '../service/groupService';

const readFunc = async (req, res) => {
    try {
        let data = await groupService.getGroups();
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
    readFunc
}