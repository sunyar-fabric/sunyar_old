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
    let chaincode;
    if (planHashCode) {
      //CASH ASSISTANCE MUST BE IN ERESPONSE
      //NEEDY INFROMATION MUST BE IN RESPONSE
      args = { planHashCode, planName: "", ownerOrgName: "" };
      method = "GetBeneficiarysByPlan";
      chaincode = "chaincodeName3"
    } else if (planName && ownerOrgName) {
      args = { planHashCode: "", planName, ownerOrgName };
      method = "GetBeneficiarysByPlan";
      chaincode = "chaincodeName3";
    } else if (beneficiaryHashCode) {
      //TEST MIDDLEWARE
      args = {
        beneficiaryHashCode,
      };
      method = "GetPlansByBeneficiary";
      chaincode = "chaincodeName2";
      //TEST MIDDLEWARE
    } else {
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
    }
    if (method && args && chaincode) {
      const sunyarMidManager = context.sunyarMidManager;
      //TEST MIDDLEWARE
      context = loadMiddleware(context, chaincode, "query", method, args);
      await sunyarMidManager.send(context);
      let result = [];
      if (planHashCode) {
        for (let beneficiary of sunyarMidManager.response.beneficiarys) {
          if (beneficiary.cashAssistanceDetail) {
            result.push({
              beneficiaryHashCode: beneficiary.beneficiaryHashCode,
              cashAssistanceDetail: JSON.parse(
                beneficiary.cashAssistanceDetail
              ),
            });
          }
        }
      } else if (beneficiaryHashCode) {
        for (let plan of sunyarMidManager.response.planList) {
          if (plan.cashAssistanceDetail) {
            result.push({
              planHashCode: plan.planHashCode,
              cashAssistanceDetail: JSON.parse(plan.cashAssistanceDetail),
            });
          }
        }
      }
      return setContextOutput(context, result);
      //TEST MIDDLEWARE
    }
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
        //CreateAsset
        method = "CreateBeneficiaryToPlan";
        let beneficiaryObj = {
          beneficiaryHashCode: bulkNeedyAddPlanTx,
          beneficiaryDuration: context.params.tDate,
        };
        beneficiaryObj = JSON.stringify(beneficiaryObj);
        args = {
          planHashCode,
          beneficiaryObj,
        };
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
