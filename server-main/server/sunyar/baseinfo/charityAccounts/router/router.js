const { createError } = require('../../../../utility/error/errorHandling');

const { wsLoadCharityAccounts, wsCreateCharityAccounts, wsUpdateCharityAccounts, wsDeleteCharityAccounts } = require('../../charityAccounts/compositeServices/charityAccounts');
const { validateLoadCharityAccounts, validateCreateCharityAccounts, validateDeleteCharityAccounts, validateUpdateCharityAccounts } = require('./validator');
const {authorizeRequest} = require("../../../../cms/um/jwt/compositeServices/authorization");

const sunyarRouter = require('express').Router();

sunyarRouter.get('/', (req, _, next) => authorizeRequest(req, ['ACCOUNTANT'], next),async (req, res, next) => {
    try {
        const { error } = await validateLoadCharityAccounts(req.query, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }

        req.context.params = req.query;
        req.context = await wsLoadCharityAccounts(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

sunyarRouter.post('/', (req, _, next) => authorizeRequest(req, 'ADMIN', next),async (req, res, next) => {
    try {

        const { error } = await validateCreateCharityAccounts(req.body, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);

        }

        const {
            bankId,
            branchName,
            ownerName,
            cardNumber,
            accountNumber,
            accountName,

        } = req.body;

        req.context.params = {
            bankId,
            branchName,
            ownerName,
            cardNumber,
            accountNumber,
            accountName,
        };

        req.context = await wsCreateCharityAccounts(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

sunyarRouter.put('/:charityAccountId', (req, _, next) => authorizeRequest(req, 'ADMIN', next) ,async (req, res, next) => {
    try {
      
        req.body.charityAccountId = req.params.charityAccountId
        const { error } = await validateUpdateCharityAccounts(req.body, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }

       
        const {
            charityAccountId,
            bankId,
            branchName,
            ownerName,
            cardNumber,
            accountNumber,
            accountName
        } = req.body;

        req.context.params = {
            charityAccountId,
            bankId,
            branchName,
            ownerName,
            cardNumber,
            accountNumber,
            accountName

        };

        req.context = await wsUpdateCharityAccounts(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

sunyarRouter.delete('/:charityAccountId', (req, _, next) => authorizeRequest(req, 'ADMIN', next),async (req, res, next) => {
    try {
        const { error } = await validateDeleteCharityAccounts(req.params, req.language)
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        }

        req.context.params = req.params;
        req.context = await wsDeleteCharityAccounts(req.context);
        res.status(204).json(req.context.result);
        next();
    } catch (error) { next(error); }

});

module.exports = sunyarRouter