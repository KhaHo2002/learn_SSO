import db from '../models/index';

const getGroups = async () => {
    try {
        let data = await db.Group.findAll({
            order: [['name', 'ASC']]
        });
        return {
            status: 'Get groups success',
            errorCode: 0,
            data: data
        }
    } catch (error) {
        console.log(error);
        return {
            status: 'error from service',
            errorCode: 1,
            data: []
        }
    }
}

module.exports = {
    getGroups
}