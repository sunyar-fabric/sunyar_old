const db = require("../../../../config/dbIndex");
const { dbErrorHandling } = require("../../../../utility/error/dbError");
const { setContextOutput } = require("../../../../utility/logging");
const {
  loadMiddleware,
} = require("../../../../utility/middleware/initMiddleware");
const SuccorCash = db.tblCashAssistanceDetail;

const loadSuccorCash = async (context) => {
  try {
    if (context.input.planHashCode && context.input.beneficiaryHashCode) {
      //mid
      //TEST MIDDLEWARE
      const sunyarMidManager = context.sunyarMidManager;
      const args = {
        beneficiaryHashCode: context.input.planHashCode,
        planHashCode: context.input.beneficiaryHashCode,
      };
      context = loadMiddleware(
        context,
        "chaincodeName4",
        "query",
        "ReadAsset",
        args
      );
      await sunyarMidManager.send(context);
      return setContextOutput(context, sunyarMidManager.response)
      //TEST MIDDLEWARE
    }
    //or fetch from db
    return await setContextOutput(
      context,
      await SuccorCash.findAll({
        where: context.input,
        include: [
          {
            model: db.tblAssignNeedyToPlan,
            required: false,
            include: [
              {
                model: db.tblPersonal,
                required: true,
                attributes: {
                  exclude: ["personPhoto"],
                },
              },
              {
                model: db.tblPlan,
                required: true,
              },
            ],
          },
        ],
      })
    );
  } catch (error) {
    await dbErrorHandling(error, context);
  }
};

const createSuccorCash = async (context) => {
  try {
    return setContextOutput(
      context,
      await db.sequelize.transaction(async (t) => {
        let succorCashT = await SuccorCash.create(
          {
            assignNeedyPlanId: context.input.assignNeedyPlanId,
            planId: context.input.planId,
            neededPrice: context.input.neededPrice,
            minPrice: context.input.minPrice,
            description: context.input.description,
          },
          { transaction: t }
        );
        //TEST MIDDLEWARE
        const sunyarMidManager = context.sunyarMidManager;
        const args = {
          planHashCode: context.input.planHashCode,
          beneficiaryHashCode: context.input.beneficiaryHashCode,
          neededPrice: context.input.neededPrice,
          minPrice: context.input.minPrice,
          description: context.input.description,
        };
        context = loadMiddleware(
          context,
          "chaincodeName4",
          "tx",
          "CreateCashAssistance",
          args
        );
        await sunyarMidManager.send(context);
        succorCashT.response = sunyarMidManager.response; //get asset
        return setContextOutput(context, succorCashT);
        //TEST MIDDLEWARE
      })
    );
  } catch (error) {
    await dbErrorHandling(error, context);
  }
  return context;
};

const updateSuccorCash = async (context) => {
  try {
    return setContextOutput(
      context,
      await db.sequelize.transaction(async (t) => {
        let updateResult = await SuccorCash.update(
          {
            assignNeedyPlanId: context.input.assignNeedyPlanId,
            planId: context.input.planId,
            neededPrice: context.input.neededPrice,
            minPrice: context.input.minPrice,
            description: context.input.description,
          },
          {
            where: {
              cashAssistanceDetailId: context.input.cashAssistanceDetailId,
            },
            transaction: t,
          }
        );
        //TEST MIDDLEWARE
        const sunyarMidManager = context.sunyarMidManager;
        const args = {
          planHashCode: context.input.planHashCode,
          beneficiaryHashCode: context.input.beneficiaryHashCode,
          neededPrice: context.input.neededPrice,
          minPrice: context.input.minPrice,
          description: context.input.description,
        };
        context = loadMiddleware(
          context,
          "chaincodeName4",
          "tx",
          "UpdateAsset",
          args
        );
        await sunyarMidManager.send(context);
        //TEST MIDDLEWARE
        if (updateResult[0] == 1) {
          return await SuccorCash.findByPk(
            context.input.cashAssistanceDetailId
          );
        }
      })
    );
  } catch (error) {
    await dbErrorHandling(error, context);
  }
};

const deleteSuccorCash = async (context) => {
  try {
    return await setContextOutput(
      context,
      await db.sequelize.transaction(async (t) => {
        let succorCashT = await SuccorCash.destroy({
          where: {
            cashAssistanceDetailId: context.input.cashAssistanceDetailId,
          },
          transaction: t,
        });
        //TEST MIDDLEWARE
        const sunyarMidManager = context.sunyarMidManager;
        const args = {
          planHashCode: context.input.planHashCode,
          beneficiaryHashCode: context.input.beneficiaryHashCode,
        };
        context = loadMiddleware(
          context,
          "chaincodeName4",
          "tx",
          "DeleteAsset",
          args
        );
        await sunyarMidManager.send(context);
        succorCashT.response = sunyarMidManager.response;
        return succorCashT;
        //TEST MIDDLEWARE
      })
    );
  } catch (error) {
    await dbErrorHandling(error, context);
  }
};

module.exports = {
  loadSuccorCash,
  createSuccorCash,
  updateSuccorCash,
  deleteSuccorCash,
};
