const { setContextInput } = require("../../../../utility/logging");
const { createError } = require("../../../../utility/error/errorHandling");
const { GlobalExceptions } = require("../../../../utility/error/exceptions");
const {
  loadNeedyToPlan,
  createNeedyToPlan,
  updateNeedyToPlan,
  deleteNeedyToPlan,
} = require("../atomicServices/needyToPlan");
const {
  loadSuccorCash,
} = require("../../../plan/succorCash/atomicServices/succorCash");
const { loadPlan } = require("../../plan/atomicServices/plan");
const {
  loadPersonal,
} = require("../../../../cms/um/personal/atomicServices/personal");

const wsLoadNeedyToPlan = async (context) => {
  for (x in context.params) {
    if (context.params[x] == "null") {
      context.params[x] = null;
    }
  }
  if (
    !context.params.planHashCode &&
    !(context.params.planName && context.params.ownerOrgName) &&
    !context.params.beneficiaryHashCode
  ) {
    const plan = await loadPlan(setContextInput(context, context.params));
    // console.log("boom", plan.outputs[0][0]?.neededLogin );
    // console.log("THIS IS BOOM", context.auth);
    if (plan.outputs[0][0]?.neededLogin) {
      if (!context.auth) {
        throw createError(GlobalExceptions.jwt.Forbidden);
      }
    }
  }
  context = await loadNeedyToPlan(setContextInput(context, context.params));
  context.result = context.output;
  return context;
};

const wsCreateNeedyToPlan = async (context) => {
  let loadPlanDate = await loadPlan(
    setContextInput(context, { planId: context.params.planId })
  );
  const planHashCode = loadPlanDate.output[0].planHashCode;
  if (
    Date.parse(loadPlanDate.output[0].fDate) >
      Date.parse(context.params.fDate) ||
    Date.parse(loadPlanDate.output[0].tDate) < Date.parse(context.params.tDate)
  ) {
    throw createError(GlobalExceptions.plan.PlanFDateTDate);
  }
  
  let bulkNeedyAddPlanTx = [];
  let lastId;
  for (let id of context.params.needyId) {
    const needy = await loadPersonal(
      setContextInput(context, { personId: id })
    );
    if (lastId != id) {
      bulkNeedyAddPlanTx.push(needy.output[0].secretCode);
    }
    lastId = id;
  }
  const needyToPlan = await loadNeedyToPlan(
    setContextInput(context, { planId: context.params.planId })
  );

  const planHasNeedy = needyToPlan.output[0] ? true : false;

  if (needyToPlan.output[0]) {
    //find preivious needy hashess and concat with input needyId
    // return

    for (let assigned of needyToPlan.output) {
      const needy = await loadPersonal(
        setContextInput(context, { personId: assigned.needyId })
      );

      bulkNeedyAddPlanTx.push(needy.output[0].secretCode);
    }
  }
  context = await createNeedyToPlan(
    setContextInput(context, {
      planId: context.params.planId,
      needyId: context.params.needyId,
      fDate: context.params.fDate,
      tDate: context.params.tDate,
      benHashes: context.params.benHashes,
      planHasNeedy,
      bulkNeedyAddPlanTx,
      planHashCode,
    })
  );
  context.result = {
    assignNeedyPlanId: context.output.map((a) => a.assignNeedyPlanId),
  };
  return context;
};

const wsUpdateNeedyToPlan = async (context) => {
  let loadPlanDate = await loadPlan(
    setContextInput(context, { planId: context.params.planId })
  );
  if (
    Date.parse(loadPlanDate.output[0].fDate) >
      Date.parse(context.params.fDate) ||
    Date.parse(loadPlanDate.output[0].tDate) < Date.parse(context.params.tDate)
  ) {
    throw createError(GlobalExceptions.plan.PlanFDateTDate);
  }

  // const benChanged = [];
  const changedBeneficiaryHashList = [];
  // const benDeleted = [];
  let benHashChanged = [];

  //update needy tDate
  for (let j; j < context.params.needyId.length; j++) {
    const needy = await loadPersonal(
      setContextInput(context, { personId: context.params.needyId[j] })
    );
    const needyHashCode = needy.output[0].secretCode;
    changedBeneficiaryHashList[j] = {
      beneficiaryHashCode: needyHashCode,
      // beneficiaryDuration: context.params.tDate,
    };
  }

  // for (let i; i < context.params.benHashDeleted.length; i++) {
  //   benDeleted[i] = {
  //     beneficiaryHashCode: context.params.benHashDeleted[i],
  //     beneficiaryDuration: [context.params.fDate, context.params.tDate],
  //   };
  // }

  context = await updateNeedyToPlan(
    setContextInput(context, {
      assignNeedyPlanId: context.params.assignNeedyPlanId,
      planId: context.params.planId,
      needyId: context.params.needyId,
      fDate: context.params.fDate,
      tDate: context.params.tDate,
      planHashCode: loadPlanDate.output[0].planHashCode,
      changedBeneficiaryHashList,
    })
  );
  context.result = context.output;

  return context;
};

const wsDeleteNeedyToPlan = async (context) => {
  context = await loadSuccorCash(
    setContextInput(context, {
      assignNeedyPlanId: context.params.assignNeedyPlanId,
    })
  );
  if (context.output[0]) {
    throw createError(GlobalExceptions.dependecyError);
  }
  context.params.bulkNeedyAdd = [];
  context.params.bulkNeedyDel = [];
  //load assigned needy to plan and find needy id
  const assignNeedyPlanId = context.params.assignNeedyPlanId;
  let needyToPlan = await loadNeedyToPlan(
    setContextInput(context, { assignNeedyPlanId })
  );
  const planId = needyToPlan.output[0].planId;
  const deletedNeedyId = needyToPlan.output[0].needyId;
  const fDate = needyToPlan.output[0].fDate;
  const tDate = needyToPlan.output[0].tDate;
  //load needy secretCode
  const deletedNeedy = await loadPersonal(
    setContextInput(context, { personId: deletedNeedyId })
  );
  const deletedSecretCode = deletedNeedy.output[0].secretCode;
  context.params.bulkNeedyDel.push({
    beneficiaryHashCode: deletedSecretCode,
    beneficiaryDuration: tDate,
  });
  //find plan needys
  //seperate deleted ids
  needyToPlan = await loadNeedyToPlan(setContextInput(context, { planId }));
  if (needyToPlan.output[0]) {
    for (let assigned of needyToPlan.output) {
      if (deletedNeedyId != assigned.needyId) {
        const needy = await loadPersonal(
          setContextInput(context, { personId: assigned.needyId })
        );
        context.params.bulkNeedyAdd.push({
          beneficiaryHashCode: needy.output[0].secretCode,
          beneficiaryDuration: context.params.tDate,
        });
      }
    }
  }

  let loadedPlan = await loadPlan(setContextInput(context, { planId }));
  context.params.planHashCode = loadedPlan.output[0].planHashCode;

  context = await deleteNeedyToPlan(setContextInput(context, context.params));
  if (context.output === 0) {
    throw createError(GlobalExceptions.plan.notFound);
  }
  context.result = context.output;

  return context;
};

module.exports = {
  wsLoadNeedyToPlan,
  wsCreateNeedyToPlan,
  wsUpdateNeedyToPlan,
  wsDeleteNeedyToPlan,
};
