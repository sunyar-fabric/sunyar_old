const { setContextInput } = require("../../../../utility/logging");
const { createError } = require("../../../../utility/error/errorHandling");
const { GlobalExceptions } = require("../../../../utility/error/exceptions");
const {
  loadSuccorCash,
  createSuccorCash,
  updateSuccorCash,
  deleteSuccorCash,
} = require("../atomicServices/succorCash");
const {
  loadPayment,
} = require("../../../operation/payment/atomicServices/payment");
const { loadPlan } = require("../../plan/atomicServices/plan");
const {
  loadNeedyToPlan,
} = require("../../needyToPlan/atomicServices/needyToPlan");
const {
  loadPersonal,
} = require("../../../../cms/um/personal/atomicServices/personal");
const needyToPlan = require("../../needyToPlan/model/needyToPlan");

const wsLoadSuccorCash = async (context) => {
  for (x in context.params) {
    if (context.params[x] == "null") {
      context.params[x] = null;
    }
  }
  context = await loadSuccorCash(setContextInput(context, context.params));
  context.result = context.output;
  return context;
};

const wsCreateSuccorCash = async (context) => {
  let loadUniqueKeys = await loadSuccorCash(
    setContextInput(context, {
      assignNeedyPlanId: context.params.assignNeedyPlanId,
      planId: context.params.planId,
    })
  );
  if (loadUniqueKeys.output[0] != null) {
    throw createError(GlobalExceptions.plan.succorUnique);
  }

  if (Number(context.params.minPrice) > Number(context.params.neededPrice)) {
    throw createError(GlobalExceptions.plan.overMinPrice);
  }

  //load plan hash and beneficiary hash
  //planID, assignNeedyID
  let planHashCode = await loadPlan(
    setContextInput(context, { planId: context.params.planId })
  );
  planHashCode = planHashCode.output[0].planHashCode;
  let needyId = await loadNeedyToPlan(
    setContextInput(context, {
      assignNeedyPlanId: context.params.assignNeedyPlanId,
    })
  );
  needyId = needyId.output[0].needyId; //must throw error if not exist!
  let secretCode = await loadPersonal(
    setContextInput(context, { personId: needyId })
  );
  secretCode = secretCode.output[0].secretCode;
  context = await createSuccorCash(
    setContextInput(context, {
      planHashCode,
      beneficiaryHashCode: secretCode,
      assignNeedyPlanId: context.params.assignNeedyPlanId,
      planId: context.params.planId,
      neededPrice: context.params.neededPrice,
      minPrice: context.params.minPrice,
      description: context.params.description,
    })
  );
  context.result = {
    cashAssistanceDetailId: context.output.cashAssistanceDetailId,
  };
  return context;
};

const wsUpdateSuccorCash = async (context) => {
  let loadUniqueKeys = await loadSuccorCash(
    setContextInput(context, {
      assignNeedyPlanId: context.params.assignNeedyPlanId,
      planId: context.params.planId,
    })
  );
  if (
    loadUniqueKeys.output[0] != null &&
    loadUniqueKeys.output[0].cashAssistanceDetailId !=
      context.params.cashAssistanceDetailId
  ) {
    throw createError(GlobalExceptions.plan.succorUnique);
  }

  if (Number(context.params.minPrice) > Number(context.params.neededPrice)) {
    throw createError(GlobalExceptions.plan.overMinPrice);
  }

  let planHashCode = await loadPlan(
    setContextInput(context, { planId: context.params.planId })
  );
  planHashCode = planHashCode.output[0].planHashCode;
  let needyId = await loadNeedyToPlan(
    setContextInput(context, { planId: context.params.planId })
  );
  needyId = needyId.output[0].needyId;

  let secretCode = await loadPersonal(
    setContextInput(context, { personId: needyId })
  );
  secretCode = secretCode.output[0].secretCode;

  context = await updateSuccorCash(
    setContextInput(context, {
      cashAssistanceDetailId: context.params.cashAssistanceDetailId,
      assignNeedyPlanId: context.params.assignNeedyPlanId,
      planId: context.params.planId,
      neededPrice: context.params.neededPrice,
      minPrice: context.params.minPrice,
      description: context.params.description,
      planHashCode,
      beneficiaryHashCode: secretCode,
    })
  );
  context.result = context.output;

  return context;
};

const wsDeleteSuccorCash = async (context) => {
  context = await loadPayment(
    setContextInput(context, {
      cashAssistanceDetailId: context.params.cashAssistanceDetailId,
    })
  );
  if (context.output[0]) {
    throw createError(GlobalExceptions.dependecyError);
  }

  let planId = await loadSuccorCash(
    setContextInput(context, {
      cashAssistanceDetailId: context.params.cashAssistanceDetailId,
    })
  );
  planId = planId.output[0].planId;
  let needyId = await loadNeedyToPlan(setContextInput(context, { planId }));
  needyId = needyId.output[0].needyId;
  let secretCode = await loadPersonal(
    setContextInput(context, { personId: needyId })
  );
  secretCode = secretCode.output[0].secretCode;
  let planHashCode = await loadPlan(setContextInput(context, { planId }));
  planHashCode = planHashCode.output[0].planHashCode;

  context.params.planHashCode = planHashCode;
  context.params.beneficiaryHashCode = secretCode;

  context = await deleteSuccorCash(setContextInput(context, context.params));
  context.result = context.output;

  return context;
};

module.exports = {
  wsCreateSuccorCash,
  wsUpdateSuccorCash,
  wsLoadSuccorCash,
  wsDeleteSuccorCash,
};
