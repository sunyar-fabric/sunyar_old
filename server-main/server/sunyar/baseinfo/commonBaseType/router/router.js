const { createError } = require('../../../../utility/error/errorHandling');
const { wsLoadBaseType, wsCreateBaseType, wsUpdateBaseType, wsDeleteBaseType } = require('../compositeServices/commonBaseType');
const { validateLoadBaseType, validateCreateBaseType, validateDeleteBaseType, validateUpdateBaseType } = require('./validator');
const {authorizeRequest} = require("../../../../cms/um/jwt/compositeServices/authorization")
const getRandomString = require('../compositeServices/fnGetRandomString');
const router = require('express').Router();

//---------------------------------------------------------------------------------------
// BaseInfo -----------------------------------------------------------------------------
//---------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------
// Base Info 1 => CommonBaseType --------------------------------------------------------
//---------------------------------------------------------------------------------------

router.get('/' , (req, _, next) => authorizeRequest(req, 'ADMIN', next),async (req, res, next) => {
    try {
        console.log("**", req.language);
        const { error } = await validateLoadBaseType(req.query, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }
        req.context.params = req.query;
        req.context = await wsLoadBaseType(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

 router.post('/',(req, _, next) => authorizeRequest(req, 'ADMIN', next), async (req, res, next) => {
    try {
        req.body.baseTypeCode = getRandomString.fnGetRandomString(3)
        const { error } = await validateCreateBaseType(req.body, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }

        const {
            baseTypeTitle,
            baseTypeCode

        } = req.body;

        req.context.params = {
            baseTypeTitle,
            baseTypeCode
        };

        req.context = await wsCreateBaseType(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

router.put('/:commonBaseTypeId',(req, _, next) => authorizeRequest(req, 'ADMIN', next), async (req, res, next) => {
    try {
        req.body.commonBaseTypeId = req.params.commonBaseTypeId
        const { error } = await validateUpdateBaseType(req.body, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }

        const {
            commonBaseTypeId,
            baseTypeTitle,
        } = req.body;

        req.context.params = {
            commonBaseTypeId,
            baseTypeTitle
        };
        req.context = await wsUpdateBaseType(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { 
        console.log(error);
        next(error); }
});

router.delete('/:commonBaseTypeId',(req, _, next) => authorizeRequest(req, 'ADMIN', next), async (req, res, next) => {
    try {


        const { error } = await validateDeleteBaseType(req.params, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }
        req.context.params = req.params;
        req.context = await wsDeleteBaseType(req.context);
        res.status(204).json(req.context.result);
        next();
    } catch (error) { next(error); }
});


module.exports = router