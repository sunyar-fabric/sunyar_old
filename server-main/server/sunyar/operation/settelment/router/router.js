const {
  authorizeRequest,
} = require("../../../../cms/um/jwt/compositeServices/authorization");
const { createError } = require("../../../../utility/error/errorHandling");
const {
  wsCreateSettelment,
  wsDeleteSettelment,
  wsLoadCharitySettelment,
  wsLoadDonatorSettelment,
} = require("../compositeServices/settelment");
const sunyarRouter = require("express").Router();

//---------------------------------------------------------------------------------------
// Operation ----------------------------------------------------------------------------
//---------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------
// Operation 2 ---> SETTELMENT ----------------------------------------------------------
//---------------------------------------------------------------------------------------

//  (req, _, next) => { authorizeRequest(req, "ACCOUNTANT", next);},
sunyarRouter.post(
  "/",
  async (req, res, next) => {
    try {
      // const { error } = await validateCreatePayment(req.body)
      // if (error) {
      //     const { details } = error;
      //     const message = details.map(i => i.message).join(',');
      //     throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
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
        planHashCode,
        beneficiaryHashCode,
        targetNgoName,
        status,
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
        planHashCode,
        beneficiaryHashCode,
        targetNgoName,
        status: "002",
        sourceNgoName: req.charityConfig.orgMSP,
      };
      req.context = await wsCreateSettelment(req.context);
      res.json(req.context.result);
      next();
    } catch (error) {
      next(error);
    }
  }
);

sunyarRouter.get(
  "/donatorSettelment",
  (req, _, next) => {
    authorizeRequest(req, "ACCOUNTANT", next);
  },
  async (req, res, next) => {
    try {
      // const { error } = await validateLoadPayment(req.query)
      // if (error) {
      //     const { details } = error;
      //     const message = details.map(i => i.message).join(',');
      //     throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
      // }

      req.context.params = req.query;
      req.context = await wsLoadDonatorSettelment(req.context);
      res.json(req.context.result);
      next();
    } catch (error) {
      next(error);
    }
  }
);

sunyarRouter.get(
  "/charitySettelment",
  (req, _, next) => {
    authorizeRequest(req, "ACCOUNTANT", next);
  },
  async (req, res, next) => {
    try {
      // const { error } = await validateLoadPayment(req.query)
      // if (error) {
      //     const { details } = error;
      //     const message = details.map(i => i.message).join(',');
      //     throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
      // }

      req.context.params = req.query;
      req.context = await wsLoadCharitySettelment(req.context);
      res.json(req.context.result);
      next();
    } catch (error) {
      next(error);
    }
  }
);

sunyarRouter.delete(
  "/:paymentId",
  (req, _, next) => {
    authorizeRequest(req, "ACCOUNTANT", next);
  },
  async (req, res, next) => {
    try {
      // const { error } = await validateDeleteSuccorCash(req.params)
      // if (error) {
      //     const { details } = error;
      //     const message = details.map(i => i.message).join(',');
      //     throw createError({ code: 2, message: message, httpStatusCode: 400 }, req.context);
      // }

      req.context.params = req.params;
      req.context = await wsDeleteSettelment(req.context);
      res.status(204).json(req.context.result);
      next();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = sunyarRouter;
