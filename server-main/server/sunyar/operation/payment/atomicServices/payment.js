const db = require("../../../../config/dbIndex");
const { dbErrorHandling } = require("../../../../utility/error/dbError");
const { setContextOutput } = require("../../../../utility/logging");
const { Op } = require("sequelize");
const {
  loadMiddleware,
} = require("../../../../utility/middleware/initMiddleware");
const Payment = db.tblPayment;

const loadPayment = async (context) => {
  try {
    return await setContextOutput(
      context,
      await Payment.findAll({
        where: context.input,
        include: [
          {
            model: db.tblCashAssistanceDetail,
            required: true,
            include: [
              {
                model: db.tblPlan,
                required: true,
              },
            ],
          },
          {
            model: db.tblCharityAccounts,
            required: false,
          },
          {
            model: db.tblPersonal,
            required: false,
            as: "donator",
          },
          {
            model: db.tblPersonal,
            required: false,
            as: "needy",
          },
        ],
      })
    );
  } catch (error) {
    await dbErrorHandling(error, context);
  }
};

const loadSettelment = async (context) => {
  try {
    context.input.charityAccountId = {
      [Op.not]: null,
    };
    return await setContextOutput(
      context,
      await Payment.findAll({
        where: context.input,
        include: [
          {
            model: db.tblCashAssistanceDetail,
            required: true,
            include: [
              {
                model: db.tblPlan,
                required: true,
              },
            ],
          },
          {
            model: db.tblCharityAccounts,
            required: false,
          },
          {
            model: db.tblPersonal,
            required: false,
            as: "donator",
          },
          {
            model: db.tblPersonal,
            required: false,
            as: "needy",
          },
        ],
      })
    );
  } catch (error) {
    await dbErrorHandling(error, context);
  }
};

const loadSumPayment = async (context) => {
  try {
    return await setContextOutput(
      context,
      await Payment.findAll({
        where: context.input,
        attributes: [
          [
            db.sequelize.fn("SUM", db.sequelize.col("paymentPrice")),
            "totalPaymentPrice",
          ],
        ],
      })
    );
  } catch (error) {
    await dbErrorHandling(error, context);
  }
};

const createPayment = async (context) => {
  try {
    return setContextOutput(
      context,
      await db.sequelize.transaction(async (t) => {
        let paymentT = await Payment.create(
          {
            donatorId: context.input.donatorId,
            cashAssistanceDetailId: context.input.cashAssistanceDetailId,
            paymentPrice: context.input.paymentPrice,
            paymentGatewayId: context.input.paymentGatewayId,
            paymentDate: context.input.paymentDate,
            paymentTime: context.input.paymentTime,
            paymentStatus: context.input.paymentStatus,
            sourceAccoutNumber: context.input.sourceAccoutNumber,
            targetAccountNumber: context.input.targetAccountNumber,
            charityAccountId: context.input.charityAccountId,
            followCode: context.input.followCode,
            needyId: context.input.needyId,
          },
          { transaction: t }
        );
        //TEST MIDDLEWARE
        const sunyarMidManager = context.sunyarMidManager;
        let args = {
          planHashCode: context.input.planHashCode,
          beneficiaryHashCode: context.input.beneficiaryHashCode,
          amount: context.input.paymentPrice,
          dateTime: context.input.paymentDate,
          sourceNgoName: context.charityConfig.orgMSP,
          targetNgoName: context.input.targetNgoName,
          status: "001",
          donatorNationalCode: context.input.donatorNationalCode,
        };
        context = loadMiddleware(
          context,
          "chaincodeName5",
          "tx",
          "CreateOperation",
          args
        );
        await sunyarMidManager.send(context);
        paymentT.response = sunyarMidManager.response;
        //TEST MIDDLEWARE

        //get total payments from core
        if(context.input.getTotalPayment){
        //TEST MIDDLEWARE
          args = {
            planHashCode:context.input.planHashCode,
            status: "001",
            beneficiaryHashCode: context.input.beneficiaryHashCode
          }
          context = loadMiddleware(
            context,
            "chaincodeName5",
            "tx",
            "ReadAllAssets",
            args
          );
          await sunyarMidManager.send(context);
          //calculate total price!!!
          paymentT.totalPaymentPrice = sunyarMidManager.response.totalPaymentPrice;
          paymentT.trackingCode = sunyarMidManager.response.trackingCode;
        //TEST MIDDLEWARE
        }
        return paymentT;
      })
    );
  } catch (error) {
    await dbErrorHandling(error, context);
  }
  return context;
};

module.exports = { loadPayment, createPayment, loadSumPayment, loadSettelment };
