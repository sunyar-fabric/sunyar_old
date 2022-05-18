const { createError } = require('../../../../utility/error/errorHandling');
const { wsLoadNeedyAccounts, wsCreateNeedyAccounts, wsUpdateNeedyAccounts, wsDeleteNeedyAccounts } = require('../compositeServices/needyAccounts');
const { validateLoadNeedyAccounts, validateCreateNeedyAccounts, validateDeleteNeedyAccounts, validateUpdateNeedyAccounts } = require('./validator');
const {authorizeRequest} = require("../../../../cms/um/jwt/compositeServices/authorization");

const sunyarRouter = require('express').Router();

//---------------------------------------------------------------------------------------
// Beneficiary --------------------------------------------------------------------------
//---------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------
//Beneficiary 1 => NeedyAccounts ----------------------------------------------------
//---------------------------------------------------------------------------------------

sunyarRouter.get('/', (req, _, next) => authorizeRequest(req, ["AID", "ACCOUNTANT"], next), async (req, res, next) => {
    try {
        const { error } = await validateLoadNeedyAccounts(req.query, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }

        req.context.params = req.query;
        req.context = await wsLoadNeedyAccounts(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});


sunyarRouter.post('/',(req, _, next) => authorizeRequest(req, ['AID'], next),async (req, res, next) => {
    try {
        const { error } = await validateCreateNeedyAccounts(req.body, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }
        const {
            bankId,
            needyId,
            ownerName,
            cardNumber,
            accountNumber,
            accountName,
            shebaNumber

        } = req.body;

        req.context.params = {
            bankId,
            needyId,
            ownerName,
            cardNumber,
            accountNumber,
            accountName,
            shebaNumber
        };

        req.context = await wsCreateNeedyAccounts(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

sunyarRouter.put('/:needyAccountId', (req, _, next) => authorizeRequest(req, ['AID'], next),async (req, res, next) => {
    try {

        req.body.needyAccountId = req.params.needyAccountId

        const { error } = await validateUpdateNeedyAccounts(req.body, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);

        }

        const {
            needyAccountId,
            bankId,
            needyId,
            ownerName,
            cardNumber,
            accountNumber,
            accountName,
            shebaNumber
        } = req.body;

        req.context.params = {
            needyAccountId,
            bankId,
            needyId,
            ownerName,
            cardNumber,
            accountNumber,
            accountName,
            shebaNumber
        };
        req.context = await wsUpdateNeedyAccounts(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

sunyarRouter.delete('/:needyAccountId', (req, _, next) => authorizeRequest(req, ['AID'], next),async (req, res, next) => {
    try {

        const { error } = await validateDeleteNeedyAccounts(req.params, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }

        req.context.params = req.params;
        req.context = await wsDeleteNeedyAccounts(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});





module.exports = sunyarRouter