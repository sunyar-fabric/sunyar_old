const { createError } = require('../../../../utility/error/errorHandling');
const { wsCreateNeedyToPlan, wsUpdateNeedyToPlan, wsLoadNeedyToPlan, wsDeleteNeedyToPlan } = require('../compositeServices/needyToPlan');
const { validateLoadNeedyToPlan, validateCreateNeedyToPlan, validateDeleteNeedyToPlan, validateUpdateNeedyToPlan } = require('./validator');
const {authorizeRequest} = require("../../../../cms/um/jwt/compositeServices/authorization");

const sunyarRouter = require('express').Router();
//---------------------------------------------------------------------------------------
// Plan ---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------
// Plan 2 => Needy To Plan --------------------------------------------------------------
//---------------------------------------------------------------------------------------

sunyarRouter.get('/',async (req, res, next) => {
    try {
        const { error } = await validateLoadNeedyToPlan(req.query)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }

        req.context.params = req.query;
        req.context = await wsLoadNeedyToPlan(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

sunyarRouter.post('/', (req, _, next) => authorizeRequest(req, ["AID"], next),async (req, res, next) => {
    try {

        const { error } = await validateCreateNeedyToPlan(req.body)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }

        const {
            planId,
            needyId,
            fDate,
            tDate,
        } = req.body;

        req.context.params = {
            planId,
            needyId,
            fDate,
            tDate,
        };

        req.context = await wsCreateNeedyToPlan(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

sunyarRouter.put('/:assignNeedyPlanId', (req, _, next) => authorizeRequest(req, ["AID",], next),async (req, res, next) => {
    try {

        req.body.assignNeedyPlanId = req.params.assignNeedyPlanId
        const { error } = await validateUpdateNeedyToPlan(req.body)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }

        const {
            assignNeedyPlanId,
            planId,
            needyId,
            fDate,
            tDate,
        } = req.body;

        req.context.params = {
            assignNeedyPlanId,
            planId,
            needyId,
            fDate,
            tDate,
        };

        req.context = await wsUpdateNeedyToPlan(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

sunyarRouter.delete('/:assignNeedyPlanId', (req, _, next) => authorizeRequest(req, ["AID",], next),async (req, res, next) => {
    try {

        const { error } = await validateDeleteNeedyToPlan(req.params)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }

        req.context.params = req.params;
        req.context = await wsDeleteNeedyToPlan(req.context);
        res.status(204).json(req.context.result);
        next();
    } catch (error) { next(error); }
});

module.exports = sunyarRouter