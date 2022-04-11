const { createError } = require('../../../../utility/error/errorHandling');
 const { wsCreatePayment, wsLoadPayment , wsLoadSettelment } = require('../compositeServices/payment');
//const { validateCreatePayment, validateLoadPayment } = require('./validator');
const sunyarRouter = require('express').Router();
const {authorizeRequest} = require("../../../../cms/um/jwt/compositeServices/authorization") 
//---------------------------------------------------------------------------------------
// Operation ----------------------------------------------------------------------------
//---------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------
// Operation 1 --- PAYMENT ----------------------------------------------------------
//---------------------------------------------------------------------------------------


sunyarRouter.get('/', async (req, res, next) => {
    try {
        
        req.context.params = req.query;
        req.context = await wsLoadPayment(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});


sunyarRouter.get('/loadSettelment',async (req, res, next) => {
    try {
        // const { error } = await validateLoadPayment(req.query)
        // if (error) {
        //     const { details } = error;
        //     const message = details.map(i => i.message).join(',');
        //     throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        // }

        req.context.params = req.query;
        req.context = await wsLoadSettelment(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

sunyarRouter.post('/',async (req, res, next) => {
    try {

        // const { error } = await validateCreatePayment(req.body)
        // if (error) {
        //     const { details } = error;
        //     const message = details.map(i => i.message).join(',');
        //     throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
        // }

        const {
            donatorId,
            cashAssistanceDetailId,
            paymentPrice,
            paymentGatewayId,
            paymentDate,
            paymentTime,
            paymentStatus,
            sourceAccoutNumber,
            targetAccountNumber,
            charityAccountId, 
            followCode,
            needyId,
        } = req.body;

        req.context.params = {
            donatorId,
            cashAssistanceDetailId,
            paymentPrice,
            paymentGatewayId,
            paymentDate,
            paymentTime,
            paymentStatus,
            sourceAccoutNumber,
            targetAccountNumber,
            charityAccountId,
            followCode,
            needyId,
        };

        req.context = await wsCreatePayment(req.context);
        res.json(req.context.result);
        next();
    } catch (error) { next(error); }
});

module.exports = sunyarRouter