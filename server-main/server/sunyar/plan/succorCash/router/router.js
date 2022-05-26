const { createError } = require('../../../../utility/error/errorHandling');
const { wsCreateSuccorCash, wsUpdateSuccorCash, wsLoadSuccorCash, wsDeleteSuccorCash } = require('../compositeServices/succorCash');
const { validateLoadSuccorCash, validateCreateSuccorCash, validateDeleteSuccorCash, validateUpdateSuccorCash } = require('./validator');
const  english_digit  = require('../../../../utility/fnChangeFarsiNumber');
const {authorizeRequest} = require("../../../../cms/um/jwt/compositeServices/authorization");

const sunyarRouter = require('express').Router();

//---------------------------------------------------------------------------------------
// Plan ---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------
// Task Plan3 --- Succor Cash -----------------------------------------------------------
//---------------------------------------------------------------------------------------

sunyarRouter.get('/',async (req, res, next) => {
    try {
        const { error } = await validateLoadSuccorCash(req.query, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }

        req.context.params = req.query;
        req.context = await wsLoadSuccorCash(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

//(req, _, next) => authorizeRequest(req, ["ACCOUNTANT", "AID"], next)
sunyarRouter.post('/',async (req, res, next) => {
    try {

        if(req.body.neededPrice || req.body.minPrice){
            req.body.neededPrice = english_digit(req.body.neededPrice)
            req.body.minPrice = english_digit(req.body.minPrice)
        }
        
        const { error } = await validateCreateSuccorCash(req.body, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }

        const {
            assignNeedyPlanId,
            neededPrice,
            minPrice,
            description,
            planId
        } = req.body;

        req.context.params = {
            assignNeedyPlanId,
            neededPrice,
            minPrice,
            description,
            planId
        };
        req.context = await wsCreateSuccorCash(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

sunyarRouter.put('/:cashAssistanceDetailId', (req, _, next) => authorizeRequest(req, ["ACCOUNTANT", "AID"], next),async (req, res, next) => {
    try {

        req.body.cashAssistanceDetailId = req.params.cashAssistanceDetailId

        if(req.body.neededPrice || req.body.minPrice){
            req.body.neededPrice = english_digit(req.body.neededPrice)
            req.body.minPrice = english_digit(req.body.minPrice)
        }

        const { error } = await validateUpdateSuccorCash(req.body, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }
        const {
            cashAssistanceDetailId,
            assignNeedyPlanId,
            planId,
            neededPrice,
            minPrice,
            description
        } = req.body;

        req.context.params = {
            cashAssistanceDetailId,
            assignNeedyPlanId,
            planId,
            neededPrice,
            minPrice,
            description
        };
        req.context = await wsUpdateSuccorCash(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});


sunyarRouter.delete('/:cashAssistanceDetailId', (req, _, next) => authorizeRequest(req, ["ACCOUNTANT", "AID"], next),async (req, res, next) => {
    try {

        const { error } = await validateDeleteSuccorCash(req.params, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }

        req.context.params = req.params;

        req.context = await wsDeleteSuccorCash(req.context);
        res.status(204).json(req.context.result);
        next();
    } catch (error) { next(error); }
});




module.exports = sunyarRouter