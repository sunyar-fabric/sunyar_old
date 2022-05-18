const router = require('express').Router();
const { authorizeRequest } = require('../../jwt/compositeServices/authorization');
const { createError } = require('../../../../utility/error/errorHandling');
const { wsCreateUser, wsUpdateUser, wsLoadUser, wsDeleteUser, wsLoadUserPaginate, wsLogin, wsProfile } = require('../compositeServices/user');
const { validateCreateUser, validateUpdateUser, validateLoadUser, validateDeleteUser, validateLogin , validateLoadUserPaginate } = require('./validator');


router.post('/',(req, _, next) => authorizeRequest(req, 'ADMIN', next),async (req, res, next) => {
    try {
        const { error } = await validateCreateUser(req.body, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
        }
        const { personId, username, password, expireDate, active } = req.body;
        req.context.params = { personId, username, password, expireDate, active };
        req.context = await wsCreateUser(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

router.put('/:userId', (req, _, next) => authorizeRequest(req, ['ADMIN', "AID", "ACCOUNTANT"], next),async (req, res, next) => {
    try {
        const { error } = await validateUpdateUser(req.body, req.params.userId, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
        }
        const { personId, username, password, expireDate, active } = req.body;
        const userId = req.params.userId;
        req.context.params = { userId, personId, username, password, expireDate, active };
        req.context = await wsUpdateUser(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { 
        console.log(error);
        next(error); }
});

router.get('/', (req, _, next) => authorizeRequest(req, ['ADMIN', 'AID', 'ACCOUNTANT'], next),async (req, res, next) => {
    try {
        const { error } = await validateLoadUser(req.query, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
        }
        const { userId, personId, username, expireDate, active } = req.query;
        req.context.params = { userId, personId, username, expireDate, active };
        req.context = await wsLoadUser(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

router.get('/userPagination', (req, _, next) => authorizeRequest(req, 'ADMIN', next),async (req, res, next) => {
    try {
        const { error } = await validateLoadUserPaginate(req.query, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
        }
        
        const { page, userId, personId, username, expireDate, active } = req.query;
        req.context.params = { page, userId, personId, username, expireDate, active };
        req.context = await wsLoadUserPaginate(req.context);
        res.set("count", req.context.count).json(req.context.result);
        next();
    } catch (error) { next(error); }
});

router.delete('/:userId', (req, _, next) => authorizeRequest(req, 'ADMIN', next),async (req, res, next) => {
    try {
        const { error } = await validateDeleteUser(req.params, req.language);
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
        }
        const userId = req.params.userId;
        req.context.params = { userId };
        req.context = await wsDeleteUser(req.context);
        res.status(204).end();
        next();
    } catch (error) { next(error); }
});

router.post('/login', async (req, res, next) => {
    try {
        const { error } = await validateLogin(req.body, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
        }
        const { username, password, refreshToken} = req.body;
        req.context.params = { username, password, refreshToken };
        req.context = await wsLogin(req.context);
        res.set("x-auth-token", req.context.token).set("x-auth-refresh-token", req.context.refreshToken).json(req.context.result);
        next();
    } catch (error) { next(error); }
});

router.get('/profile', async (req, res, next) => {
    try {
        const { username} = req.query;
        req.context.params = { username};
        req.context = await wsProfile(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});


module.exports = router;