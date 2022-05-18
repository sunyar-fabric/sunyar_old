const { createError } = require('../../../../utility/error/errorHandling');
const { wsLoadBaseType } = require('../../commonBaseType/compositeServices/commonBaseType');
const { wsLoadBaseData, wsCreateBaseData, wsUpdateBaseData, wsDeleteBaseData, wsLoadBaseBank } = require('../compositeServices/commonBaseData');
const { validateLoadBaseData, validateCreateBaseData, validateDeleteBaseData, validateUpdateBaseData } = require('./validator');
const {authorizeRequest} = require("../../../../cms/um/jwt/compositeServices/authorization");
const getRandomString = require('../compositeServices/fnGetRandomString');
const sunyarRouter = require('express').Router();

//---------------------------------------------------------------------------------------
// BaseInfo -----------------------------------------------------------------------------
//---------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------
// BaseInfo 2 => CommonBaseData ---------------------------------------------------------
//---------------------------------------------------------------------------------------

sunyarRouter.get('/', (req, _, next) => authorizeRequest(req, ['ADMIN', 'AID', 'ACCOUNTANT'], next), async (req, res, next) => {
    try {
        const { error } = await validateLoadBaseData(req.query, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }

        req.context.params = req.query;
        req.context = await wsLoadBaseData(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

sunyarRouter.get('/commonBaseBank', (req, _, next) => authorizeRequest(req, ['ADMIN', 'AID', 'ACCOUNTANT'], next) , async (req, res, next) => {
    try {
        const { error } = await validateLoadBaseData(req.query,  req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }

        req.context.params = req.query;
        req.context = await wsLoadBaseBank(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

sunyarRouter.post('/', (req, _, next) => authorizeRequest(req, 'ADMIN', next),(req, _, next) => authorizeRequest(req, 'ADMIN', next),async (req, res, next) => {
    try {
        const { error } = await validateCreateBaseData(req.body,  req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }

        req.context.params = { commonBaseTypeId: req.body.commonBaseTypeId }
        let randomCode = getRandomString.fnGetRandomString(3)
        let randomBaseTypeCode = await wsLoadBaseType(req.context)
        req.body.baseCode = (randomBaseTypeCode.result)[0].baseTypeCode + randomCode

        const {
            baseValue,
            baseCode,
            commonBaseTypeId
        } = req.body;

        req.context.params = {
            baseValue,
            baseCode,
            commonBaseTypeId
        };

        req.context = await wsCreateBaseData(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

sunyarRouter.put('/:commonBaseDataId', (req, _, next) => authorizeRequest(req, 'ADMIN', next),async (req, res, next) => {
    try {
        req.body.commonBaseDataId = req.params.commonBaseDataId
       
        const { error } = await validateUpdateBaseData(req.body,  req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);

        }

        const {
            commonBaseDataId,
            baseValue,
            commonBaseTypeId
        } = req.body;

        req.context.params = {
            commonBaseDataId,
            baseValue,
            commonBaseTypeId

        };
        req.context = await wsUpdateBaseData(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});


sunyarRouter.delete('/:commonBaseDataId', (req, _, next) => authorizeRequest(req, 'ADMIN', next),async (req, res, next) => {
    try {
        const { error } = await validateDeleteBaseData(req.params,  req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }

        req.context.params = req.params;
        req.context = await wsDeleteBaseData(req.context);
        res.status(204).json(req.context.result);
        next();
    } catch (error) { next(error); }
});

module.exports = sunyarRouter