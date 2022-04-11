const { createError } = require("../../../../utility/error/errorHandling");
const { GlobalExceptions } = require("../../../../utility/error/exceptions");
const { setContextInput } = require("../../../../utility/logging");
const { loadPermission, assignPermissionToRole, deletePermission } = require("../atomicServices/assignRoleToSystemForm");


const wsAssignPermissionToRole = async (context) => {
    context = await assignPermissionToRole(setContextInput(context, {
        permission: context.params.permission
    }))
    context.result = {
        assignRoleToSystemFormId: context.output.map(a => a.assignRoleToSystemFormId)
    };
    return context;
}


const wsLoadPermission = async (context) => {
    context = await loadPermission(setContextInput(context,
        {
            assignRoleToSystemFormId: context.params.assignRoleToSystemFormId,
            systemFormId: context.params.systemFormId,
            roleId: context.params.roleId,
            hasAccess: context.params.hasAccess
        }
    ));
    context.result = context.output.map(p => {
        return {
            assignRoleToSystemFormId: p.assignRoleToSystemFormId,
            systemFormId: p.systemFormId,
            roleId: p.roleId,
            hasAccess: p.hasAccess,
            tblSystemForm: p.tblSystemForm,
            tblRole: p.tblRole
        };
    });
    return context;
}

const wsDeletePermission = async (context) => {

    context = await deletePermission(setContextInput(context, {
        roleId: context.params.roleId,
        systemFormId: context.params.systemFormId
    }));
    if (context.output === 0) {
        throw createError(GlobalExceptions.accessPermission.PermissionNotFound)
    }
    return context;
}


module.exports = { wsAssignPermissionToRole, wsLoadPermission, wsDeletePermission }