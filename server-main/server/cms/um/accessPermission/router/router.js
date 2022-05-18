const router = require('express').Router();
const { createError } = require('../../../../utility/error/errorHandling');
const { validateCreateSystemForm, validateUpdateSystemForm, validateLoadSystemForm, validateDeleteSystemForm, validateLoadPermission, validateDeletePermission, validateAssignPermissionToRole} = require('./validator');
const { wsLoadSystemForm, wsUpdateSystemForm, wsDeleteSystemForm, wsCreateSystemForm } = require('../compositeServices/systemForm');
const { wsAssignPermissionToRole, wsLoadPermission, wsDeletePermission } = require('../compositeServices/assignRoleToSystemForm');
const {authorizeRequest} = require("../../../../cms/um/jwt/compositeServices/authorization");

//---------------------------------------------------------------------------------------
// Task User5 -- accessPermission - System Form -----------------------------------------
//---------------------------------------------------------------------------------------
router.post('/systemForm', (req, _, next) => authorizeRequest(req, 'ADMIN', next),async (req, res, next) => {
    try {
        const { error } = await validateCreateSystemForm(req.body, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
        }
        const { faForm, enForm, sysKind, sysParentId } = req.body;
        req.context.params = { faForm, enForm, sysKind, sysParentId };
        req.context = await wsCreateSystemForm(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

router.put('/systemForm/:systemFormId', (req, _, next) => authorizeRequest(req, 'ADMIN', next),async (req, res, next) => {
    try {
        const { error } = await validateUpdateSystemForm(req.body, req.params.systemFormId, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
        }
        const { faForm, enForm, sysKind, sysParentId } = req.body;
        const systemFormId = req.params.systemFormId;
        req.context.params = { systemFormId, faForm, enForm, sysKind, sysParentId };
        req.context = await wsUpdateSystemForm(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

router.get('/systemForm', (req, _, next) => authorizeRequest(req, 'ADMIN', next),async (req, res, next) => {
    try {
        const { error } = await validateLoadSystemForm(req.query, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
        }
        const { systemFormId, faForm, enForm, sysKind, sysParentId } = req.query;
        req.context.params = { systemFormId, faForm, enForm, sysKind, sysParentId };
        req.context = await wsLoadSystemForm(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

router.delete('/systemForm/:systemFormId', (req, _, next) => authorizeRequest(req, 'ADMIN', next),async (req, res, next) => {
    try {
        const { error } = await validateDeleteSystemForm(req.params, req.language);
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
        }
        const systemFormId = req.params.systemFormId;
        req.context.params = { systemFormId };
        req.context = await wsDeleteSystemForm(req.context);
        res.status(204).end();
        next();
    } catch (error) { next(error); }
});

//---------------------------------------------------------------------------------------
// Task User6 -- accessPermission - AssignPermissionToRole ------------------------------
//---------------------------------------------------------------------------------------

router.post('/permission', (req, _, next) => authorizeRequest(req, 'ADMIN', next),async (req, res, next) => {
    try {
        for (let i = 0; i < req.body.permission.length; i++) {
            let body = req.body.permission[i];
            const { error } = await validateAssignPermissionToRole(body, req.language)
            if (error) {
                const { details } = error;
                const message = details.map(i => i.message).join(',');
                throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
            }
        }
        const permission = req.body.permission;
        req.context.params = { permission };
        req.context = await wsAssignPermissionToRole(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

router.get('/permission', (req, _, next) => authorizeRequest(req, 'ADMIN', next),async (req, res, next) => {
    try {
        const { error } = await validateLoadPermission(req.query, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
        }
        const { assignRoleToSystemFormId, systemFormId, roleId, hasAccess } = req.query;
        req.context.params = { assignRoleToSystemFormId, systemFormId, roleId, hasAccess };
        req.context = await wsLoadPermission(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

router.delete('/permission', (req, _, next) => authorizeRequest(req, 'ADMIN', next),async (req, res, next) => {
    try {
        const { error } = await validateDeletePermission(req.body, req.language);
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
        }
        const { roleId, systemFormId } = req.body;
        req.context.params = { roleId, systemFormId };
        req.context = await wsDeletePermission(req.context);
        res.status(204).end();
        next();
    } catch (error) { next(error); }
});


module.exports = router;