const {
  loadPersonal,
} = require("../../../../cms/um/personal/atomicServices/personal");
const personal = require("../../../../cms/um/personal/model/personal");
const db = require("../../../../config/dbIndex");
const { dbErrorHandling } = require("../../../../utility/error/dbError");
const {
  setContextOutput,
  setContextInput,
} = require("../../../../utility/logging");
const {
  loadMiddleware,
} = require("../../../../utility/middleware/initMiddleware");
const { loadPlan } = require("../../plan/atomicServices/plan");
const NeedyToPlan = db.tblAssignNeedyToPlan;

const loadNeedyToPlan = async (context) => {
  try {
    const planHashCode = context.input.planHashCode;
    const planName = context.input.planName;
    const ownerOrgName = context.input.ownerOrgName;
    const beneficiaryHashCode = context.input.beneficiaryHashCode;
    let args;
    let method;
    if (planHashCode) {
      //CASH ASSISTANCE MUST BE IN ERESPONSE
      //NEEDY INFROMATION MUST BE IN RESPONSE
      args = { planHashCode };
      method = "getBeneficiaryByPlanHashCodeProperty";
    }
    if (planName && ownerOrgName) {
      args = { planName, ownerOrgName };
      method = "ReadAsset";
    }
    if (beneficiaryHashCode) {
      //TEST MIDDLEWARE
      args = {
        beneficiaryHashCode,
      };
      context = loadMiddleware(
        context,
        "chaincodeName2",
        "query",
        "ReadAsset",
        args
      );
      //TEST MIDDLEWARE
      return setContextOutput(context, sunyarMidManager.response);
    }
    if (method && args) {
      const sunyarMidManager = context.sunyarMidManager;
      //TEST MIDDLEWARE
      context = loadMiddleware(
        context,
        "chaincodeName3",
        "query",
        method,
        args
      );
      await sunyarMidManager.send(context);
      let needy = sunyarMidManager.response.map((needy) => needy.Record);
      return setContextOutput(context, needy);
      //TEST MIDDLEWARE
    }

    context = await setContextOutput(
      context,
      await NeedyToPlan.findAll({
        where: context.input,
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
      })
    );
    return context;
  } catch (error) {
    console.log(error);
    await dbErrorHandling(error, context);
  }
};

const createNeedyToPlan = async (context) => {
  try {
    return setContextOutput(
      context,
      await db.sequelize.transaction(async (t) => {
        let bulkNeedyToPlan = [];
        for (let i = 0; i < context.input.needyId.length; i++) {
          bulkNeedyToPlan[i] = {
            planId: context.input.planId,
            needyId: context.input.needyId[i],
            fDate: context.input.fDate,
            tDate: context.input.tDate,
          };
        }
        let needyToPlanTx = await NeedyToPlan.bulkCreate(bulkNeedyToPlan, {
          transaction: t,
        });
        //first find if plan has needy assigned to it --> UpdateAsset
        //if plan does not have any needy you shall CreateAsset
        let args = {};
        let method = "";
        const bulkNeedyAddPlanTx = context.input.bulkNeedyAddPlanTx;
        const planHashCode = context.input.planHashCode;
        const planHasNeedy = context.input.planHasNeedy;
        const sunyarMidManager = context.sunyarMidManager;
        if (planHasNeedy) {
          //UpdateAsset
          method = "UpdateAsset";
          args = {
            planHashCode,
            benneficiaryAdd: bulkNeedyAddPlanTx,
            beneficiaryDuration: [context.params.fDate, context.params.tDate],
            benneficiaryDel: [],
          };
        } else {
          //CreateAsset
          method = "CreateAsset";
          args = {
            planHashCode,
            beneficiaryHashCode: bulkNeedyAddPlanTx,
            beneficiaryDuration: [context.params.fDate, context.params.tDate],
          };
        }
        //TEST MIDDLEWARE
        context = loadMiddleware(context, "chaincodeName3", "tx", method, args);
        await sunyarMidManager.send(context);
        context.result = setContextOutput(
          context,
          sunyarMidManager.response
        ).output;
        //TEST MIDDLEWARE
        needyToPlanTx.response = context.result;
        return needyToPlanTx;
      })
    );
  } catch (error) {
    await dbErrorHandling(error, context);
  }
};

const updateNeedyToPlan = async (context) => {
  try {
    db.sequelize.transaction(async (t) => {
      let updateResult = await NeedyToPlan.update(
        {
          planId: context.input.planId,
          needyId: context.input.needyId,
          fDate: context.input.fDate,
          tDate: context.input.tDate,
        },
        {
          where: { assignNeedyPlanId: context.input.assignNeedyPlanId },
          transaction: t,
        }
      );
      if (updateResult[0] == 1) {
        return await setContextOutput(
          context,
          await NeedyToPlan.findByPk(context.input.assignNeedyPlanId)
        );
      }
    });
  } catch (error) {
    await dbErrorHandling(error, context);
  }
};

const deleteNeedyToPlan = async (context) => {
  try {
    return await setContextOutput(
      context,
      await db.sequelize.transaction(async (t) => {
        let deleteNeedyToPlanT = NeedyToPlan.destroy({
          where: {
            assignNeedyPlanId: context.input.assignNeedyPlanId,
          },
          transaction: t,
        });
        //TEST MIDDLEWARE
        const sunyarMidManager = context.sunyarMidManager;
        args = {
          planHashCode: context.input.planHashCode,
          benneficiaryAdd: context.input.bulkNeedyAdd,
          benneficiaryDel: context.input.bulkNeedyDel,
        };
        context = loadMiddleware(
          context,
          "chaincodeName3",
          "tx",
          "UpdateAsset",
          args
        );
        await sunyarMidManager.send(context);
        context.result = setContextOutput(
          context,
          sunyarMidManager.response
        ).output;
        //TEST MIDDLEWARE
        return deleteNeedyToPlanT;
      })
    );
  } catch (error) {
    await dbErrorHandling(error, context);
  }
};

module.exports = {
  loadNeedyToPlan,
  createNeedyToPlan,
  updateNeedyToPlan,
  deleteNeedyToPlan,
};
