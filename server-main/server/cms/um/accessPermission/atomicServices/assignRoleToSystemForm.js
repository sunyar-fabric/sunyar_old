const db = require('../../../../config/dbIndex');
const { dbErrorHandling } = require('../../../../utility/error/dbError');
const { setContextOutput } = require("../../../../utility/logging");

const AssignRoleToSystemForm = db.tblAssignRoleToSystemForm;

const assignPermissionToRole = async (context) => {
    try {

        return setContextOutput(context, await AssignRoleToSystemForm.bulkCreate(
            context.input.permission
        ));
    } catch (error) {
        await dbErrorHandling(error, context)
    }
}

const loadPermission = async (context) => {
    try {
       
        let input = context.input;
        let query = {};
        if (input.assignRoleToSystemFormId) query.assignRoleToSystemFormId = input.assignRoleToSystemFormId;
        if (input.systemFormId) query.systemFormId = input.systemFormId;
        if (input.roleId) query.roleId = input.roleId;
        if (input.hasAccess) query.hasAccess = input.hasAccess;
       
        return setContextOutput(context, await AssignRoleToSystemForm.findAll({
            where: query,
            include: [{
                model: db.tblRole,
                required: true
            }, {
                model: db.tblSystemForm,
                required: true,
            }]
        }));

    } catch (error) {
        await dbErrorHandling(error, context)
    }
}

const deletePermission = async (context) => {
    try {

        if (context.input.roleId && context.input.systemFormId) {
            return setContextOutput(context, await AssignRoleToSystemForm.destroy({ where: { roleId: context.input.roleId, systemFormId: context.input.systemFormId } }))
        }
        if (context.input.roleId) {
            return setContextOutput(context, await AssignRoleToSystemForm.destroy({ where: { roleId: context.input.roleId } }))
        }
        if (context.input.systemFormId) {
            return setContextOutput(context, await AssignRoleToSystemForm.destroy({ where: { systemFormId: context.input.systemFormId } }))
        } else {
            context.output == 0
            return context;
        }

    } catch (error) {
        await dbErrorHandling(error, context)
    }
}

module.exports = { assignPermissionToRole, loadPermission, deletePermission };