const db = require('../../../../config/dbIndex');
const { dbErrorHandling } = require("../../../../utility/error/dbError");
const { setContextOutput } = require("../../../../utility/logging");

const AssignRoleToUser = db.tblAssignRoleToUser;


///---- For bulkCreate --------------------------------------------------
const assignRoleToUser = async (context) => {
    try {
        return setContextOutput(context, await AssignRoleToUser.bulkCreate(
            context.input.role
        ));

    } catch (error) {
        await dbErrorHandling(error, context);
    }
}

//--------  for -- each -------------------------------------------------------
// const assignRoleToUser = async (context) => {
//     try {
//         return setContextOutput(context, await AssignRoleToUser.create({
//             userId: context.input.userId,
//             roleId: context.input.roleId,
//         }));

//     } catch (error) {
//         await dbErrorHandling(error, context);
//     }
// }
//--------------------------------------------------------------------------------
const loadUserRoles = async (context) => {
    try {
        let input = context.input;
        let query = {};
        if (input.assignRoleToUserId) query.assignRoleToUserId = input.assignRoleToUserId;
        if (input.userId) query.userId = input.userId;
        if (input.roleId) query.roleId = input.roleId;

        return setContextOutput(context, await AssignRoleToUser.findAll({
            where: query,
        }));

    } catch (error) {
        await dbErrorHandling(error, context);
    }
}

const loadAssignRoleToUser = async (context) => {
    try {
        let input = context.input;
        let query = {};
        if (input.assignRoleToUserId) query.assignRoleToUserId = input.assignRoleToUserId;
        if (input.userId) query.userId = input.userId;
        if (input.roleId) query.roleId = input.roleId;

        return setContextOutput(context, await AssignRoleToUser.findAll({
            where: query,
            include: [{
                model: db.tblUser,
                required: true
            }, {
                model: db.tblRole,
                required: true
            }]
        }));

    } catch (error) {
        await dbErrorHandling(error, context);
    }
}

const getAssignRoleToUserByUserId = async (context) => {
    try {
        return setContextOutput(context, await AssignRoleToUser.findAll({
            where: { userId: context.input.userId }
        }));
    } catch (error) {
        await dbErrorHandling(error, context);
    }
}

const deleteRolesFromUser = async (context) => {
    try {
        return setContextOutput(context, await AssignRoleToUser.destroy({ where: { assignRoleToUserId: context.input.assignRoleToUserId } }))
    } catch (error) {
        await dbErrorHandling(error, context);
    }
}


module.exports = { assignRoleToUser, loadAssignRoleToUser, deleteRolesFromUser,getAssignRoleToUserByUserId, loadUserRoles};