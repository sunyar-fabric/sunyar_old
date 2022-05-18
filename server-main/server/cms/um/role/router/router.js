const router = require('express').Router();
const { createError } = require('../../../../utility/error/errorHandling');
const { wsAssignRoleToUser, wsLoadAssignRoleToUser, wsDeleteRolesFromUser } = require('../compositeServices/assignRoleToUser');
const { wsCreateRole, wsUpdateRole, wsDeleteRole, wsLoadRole } = require('../compositeServices/role');
const { validateCreateRole, validateUpdateRole, validateLoadRole, validateDeleteRole, validateDeleteRolesFromUser, validateLoadAssignRoleToUser, validateAssignRoleToUser} = require('./validator');
const {authorizeRequest} = require("../../jwt/compositeServices/authorization")

router.post('/', (req, _, next) => authorizeRequest(req, 'ADMIN', next),async (req, res, next) => {
    try {
        const { error } = await validateCreateRole(req.body, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
        }
        const { faName, enName } = req.body;
        req.context.params = { faName, enName };
        req.context = await wsCreateRole(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

router.put('/:roleId', (req, _, next) => authorizeRequest(req, 'ADMIN', next),async (req, res, next) => {
    try {
        const { error } = await validateUpdateRole(req.body, req.params.roleId, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
        }
        const { faName, enName } = req.body;
        const roleId = req.params.roleId;
        req.context.params = { roleId, faName, enName };
        req.context = await wsUpdateRole(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

router.get('/', (req, _, next) => authorizeRequest(req, 'ADMIN', next),async (req, res, next) => {
    try {
        const { error } = await validateLoadRole(req.query, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
        }
        const { userId, username, expireDate, active } = req.query;
        req.context.params = { userId, username, expireDate, active };
        req.context = await wsLoadRole(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

router.delete('/:roleId', (req, _, next) => authorizeRequest(req, 'ADMIN', next),async (req, res, next) => {
    try {
        const { error } = await validateDeleteRole(req.params, req.language);
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
        }
        const roleId = req.params.roleId;
        req.context.params = { roleId };
        req.context = await wsDeleteRole(req.context);
        res.status(204).end();
        next();
    } catch (error) { next(error); }
});

//---------------------------------------------------------------------------------------
// Task User5 -- assignRoleToUser -------------------------------------------------------
//---------------------------------------------------------------------------------------

// router.post('/', async (req, res, next) => {
//     try {
//         const { error } = await validateAssignRoleToUser(req.body)
//         if (error) {
//             const { details } = error;
//             const message = details.map(i => i.message).join(',');
//             throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
//         }
//         const { userId, roleId } = req.body;
//         req.context.params = { userId, roleId };
//         req.context = await wsAssignRoleToUser(req.context);
//         res.json(req.context.result);
//         next();
//     } catch (error) { next(error); }
// });

///----For bulk Create ------------------------------------------------------------

router.post('/assignRoleToUser', (req, _, next) => authorizeRequest(req, 'ADMIN', next),async (req, res, next) => {
    try {
        for (let i = 0; i < req.body.role.length; i++) {
            let body = req.body.role[i];
            const { error } = await validateAssignRoleToUser(body, req.language)
            if (error) {
                const { details } = error;
                const message = details.map(i => i.message).join(',');
                throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
            }
        }
        const role = req.body.role;
        req.context.params = { role };
        req.context = await wsAssignRoleToUser(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});
router.get('/assignRoleToUser', (req, _, next) => authorizeRequest(req, 'ADMIN', next),async (req, res, next) => {
    try {
        const { error } = await validateLoadAssignRoleToUser(req.query, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
        }
        const { userId, roleId, assignRoleToUserId } = req.query;
        req.context.params = { assignRoleToUserId, userId, roleId };
        req.context = await wsLoadAssignRoleToUser(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

router.delete('/assignRoleToUser/:assignRoleToUserId', (req, _, next) => authorizeRequest(req, 'ADMIN', next),async (req, res, next) => {
    try {
        const { error } = await validateDeleteRolesFromUser(req.params, req.language);
        if (error) {
            const { details } = error; 
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
        }
        const assignRoleToUserId = req.params.assignRoleToUserId;
        req.context.params = { assignRoleToUserId };
        req.context = await wsDeleteRolesFromUser(req.context);
        res.status(204).end();
        next();
    } catch (error) { next(error); }
});


module.exports = router;