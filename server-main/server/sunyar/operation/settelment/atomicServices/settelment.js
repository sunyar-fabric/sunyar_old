const db = require("../../../../config/dbIndex");
const { dbErrorHandling } = require("../../../../utility/error/dbError");
const { setContextOutput } = require("../../../../utility/logging");
const { loadMiddleware } = require("../../../../utility/middleware/initMiddleware");

const Payment = db.tblPayment;

const loadSumSettelment = async (context) => {
  try {
    for (x in context.params) {
      if (
        context.params[x] == "null" ||
        context.params[x] == undefined ||
        context.params[x] == "undefined"
      ) {
        context.params[x] = null;
      }
    }
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

const createSettelment = async (context) => {
  try {
    return setContextOutput(
      context,
      await db.sequelize.transaction(async (t) => {
        let settlementT = await Payment.create(
          {
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
          planHashCode: context.input.planName,
          beneficiaryHashCode: context.charityConfig.orgMSP,
          amout: context.input.paymentPrice,
          dateTime: context.input.paymentDate,
          sourceNgoName: context.input.sourceNgoName,
          status: context.input.status,
        };
        let chaincodeName = "";
        if (context.input.status == "002") {
          chaincodeName = "chaincodeName6";
        } else if (context.input.status == "003") {
          args.targetNgoName = context.input.targetNgoName;
          chaincodeName = "chaincodeName7";
        }
        context = loadMiddleware(
          context,
          chaincodeName,
          "tx",
          "CreateAsset",
          args
        );
        await sunyarMidManager.send(context);
        settlementT.response = sunyarMidManager.response;
        //TEST MIDDLEWARE
        return settlementT;
      })
    );
  } catch (error) {
    await dbErrorHandling(error, context);
  }
  return context;
};

const loadSettelment = async (context) => {
  try {
    return await setContextOutput(
      context,
      await Payment.findAll({
        where: context.input,
        include: [
          {
            model: db.tblCashAssistanceDetail,
            required: true,
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

const deleteSettelment = async (context) => {
  try {
    return await setContextOutput(
      context,
      await Payment.destroy({ where: { paymentId: context.input.paymentId } })
    );
  } catch (error) {
    await dbErrorHandling(error, context);
  }
};

module.exports = {
  createSettelment,
  loadSumSettelment,
  deleteSettelment,
  loadSettelment,
};
