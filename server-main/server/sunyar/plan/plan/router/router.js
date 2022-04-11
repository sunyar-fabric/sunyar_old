const { createError } = require('../../../../utility/error/errorHandling');
const { wsCreatePlan, wsUpdatePlan, wsLoadPlan, wsDeletePlan, wsLoadPlanPaginate, wsLoadPlanTree } = require('../compositeServices/plan');
const { validateCreatePlan, validateDeletePlan, validateLoadPlan, validateUpdatePlan, validateLoadPlanPaginate } = require('./validator');
const {authorizeRequest} = require("../../../../cms/um/jwt/compositeServices/authorization");

const sunyarRouter = require('express').Router();

//---------------------------------------------------------------------------------------
// Plan ---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------
// Task Plan1 --- PLAN ------------------------------------------------------------------
//---------------------------------------------------------------------------------------

///-- icone Blob and Join and delete must be checked ----------------

sunyarRouter.post('/', (req, _, next) => authorizeRequest(req, ['AID'], next),async (req, res, next) => {
    try {
        const { error } = await validateCreatePlan(req.body)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }
        const { planName, description, planNature, parentPlanId, icon, fDate, tDate, neededLogin } = req.body;
        req.context.params = { planName, description, planNature, parentPlanId, icon, fDate, tDate, neededLogin };
        req.context = await wsCreatePlan(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

sunyarRouter.put('/:planId', (req, _, next) => authorizeRequest(req, ["AID"], next),async (req, res, next) => {
    try {
        const { error } = await validateUpdatePlan(req.body, req.params.planId)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }
        const planId = req.params.planId;
        const { planName, description, planNature, parentPlanId, icon, fDate, tDate, neededLogin } = req.body;
        req.context.params = { planId, planName, description, planNature, parentPlanId, icon, fDate, tDate, neededLogin };
        req.context = await wsUpdatePlan(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

sunyarRouter.get('/',async (req,res, next) => {
    try {
        const { error } = await validateLoadPlan(req.query)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }
        const { planId, planName, planNature, parentPlanId, fDate, tDate, neededLogin } = req.query;
        req.context.params = { planId, planName, planNature, parentPlanId, fDate, tDate, neededLogin };
        req.context = await wsLoadPlan(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

sunyarRouter.get('/planPagination',async (req, res, next) => {
    try {
        const { error } = await validateLoadPlanPaginate(req.query)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }
        const { page, planId, planName, planNature, parentPlanId, fDate, tDate, neededLogin } = req.query;
        req.context.params = { page, planId, planName, planNature, parentPlanId, fDate, tDate, neededLogin };
        req.context = await wsLoadPlanPaginate(req.context);
        res.set('count', req.context.count).json(req.context.result);
        next();
    } catch (error) { next(error); }
});

sunyarRouter.get('/planTree',async (req, res, next) => {
    try {
        req.context = await wsLoadPlanTree(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

sunyarRouter.delete('/:planId', (req, _, next) => authorizeRequest(req, ["AID"], next),async (req, res, next) => {
    try {
        const { error } = await validateDeletePlan(req.params)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }
        const planId = req.params.planId;
        req.context.params = { planId };
        req.context = await wsDeletePlan(req.context);
        res.status(204).send();
        next();
    } catch (error) { next(error); }
});




module.exports = sunyarRouter