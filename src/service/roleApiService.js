import db from '../models/index';

const createNewRoles = async (roles) => {
    try {

        let currentRoles = await db.Role.findAll({
            attributes: ['url', 'description'],
            raw: true
        })

        const persists = roles.filter(({ url: url1 }) =>
            !currentRoles.some(({ url: url2 }) => url1 === url2)
        );
        if (persists.length === 0) {
            return {
                status: 'Nothing to create ...',
                errorCode: 0,
                data: []
            }
        }

        await db.Role.bulkCreate(persists);
        return {
            status: `Create roles succeeds:  ${persists.length} roles...`,
            errorCode: 0,
            data: []
        }

    } catch (error) {
        console.log(error)
        return {
            status: 'something wrongs with servies',
            errorCode: 1,
            data: []
        }
    }
}

const getAllRoles = async () => {
    try {
        let data = await db.Role.findAll({
            order: [['id', 'DESC']]
        })
        return {
            status: `Get all Roles succeeds`,
            errorCode: 0,
            data: data
        }

    } catch (error) {
        console.log(error)
        return {
            status: 'something wrongs with servies',
            errorCode: 1,
            data: []
        }
    }
}

const deleteRole = async (id) => {
    try {
        let role = await db.Role.findOne({
            where: { id: id }
        })
        if (role) {
            await role.destroy();
        }

        return {
            status: `Delete Roles succeeds`,
            errorCode: 0,
            data: []
        }

    } catch (error) {
        console.log(error)
        return {
            status: 'something wrongs with servies',
            errorCode: 1,
            data: []
        }
    }
}

const getRoleByGroup = async (id) => {
    try {
        if (!id) {
            return {
                status: `Not found any roles`,
                errorCode: 0,
                data: []
            }
        }

        let roles = await db.Group.findOne({
            where: { id: id },
            attributes: ["id", "name", "description"],
            include: {
                model: db.Role,
                attributes: ["id", "url", "description"],
                through: { attributes: [] }
            }
        })

        return {
            status: `get Roles by group succeeds`,
            errorCode: 0,
            data: roles
        }

    } catch (error) {
        console.log(error)
        return {
            status: 'something wrongs with servies',
            errorCode: 1,
            data: []
        }
    }
}

const assignRoleToGroup = async (data) => {
    try {

        await db.Group_Role.destroy({
            where: { groupId: +data.groupId }
        })
        await db.Group_Role.bulkCreate(data.groupRoles);
        return {
            status: `Assign Role to Group succeeds`,
            errorCode: 0,
            data: []
        }

    } catch (error) {
        console.log(error)
        return {
            status: 'something wrongs with servies',
            errorCode: 1,
            data: []
        }
    }
}

module.exports = {
    createNewRoles, getAllRoles, deleteRole, getRoleByGroup, assignRoleToGroup
}