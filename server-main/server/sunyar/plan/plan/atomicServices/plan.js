const Op = require("sequelize").Op;
const db = require("../../../../config/dbIndex");
const { dbErrorHandling } = require("../../../../utility/error/dbError");
const {
  setContextOutput,
  setContextInput,
} = require("../../../../utility/logging");
const {
  loadMiddleware,
} = require("../../../../utility/middleware/initMiddleware");
const Plan = db.tblPlan;

const createPlan = async (context) => {
  try {
    return setContextOutput(
      context,
      await db.sequelize.transaction(async (t) => {
        let planT = await Plan.create(
          {
            planName: context.input.planName,
            description: context.input.description,
            planNature: context.input.planNature,
            parentPlanId: context.input.parentPlanId,
            icon: context.input.icon,
            fDate: context.input.fDate,
            tDate: context.input.tDate,
            neededLogin: context.input.neededLogin,
          },
          { transaction: t }
        );
        //TEST MIDDLEWARE
        const sunyarMidManager = context.sunyarMidManager;
        if (context.params.isFinal) {
          const args = {
            planName: context.input.planName,
            ownerOrgName: context.charityConfig.orgMSP,
            durationDate: context.input.tDate, //[context.input.fDate, context.input.tDate]
            parentPlanHashCode: context.input.parentPlanHashCode,
          };
          context = loadMiddleware(
            context,
            "chaincodeName2",
            "tx",
            "CreateAsset",
            args
          );
          await sunyarMidManager.send(context);
          Plan.update(
            {
              planHashCode: sunyarMidManager.response.planHashCode,
            },
            {
              where: { planId: context.input.planId },
            }
          );
        }
        planT.planHashCode = sunyarMidManager.response.planHashCode;
        return planT;
        //TEST MIDDLEWARE
      })
    );
  } catch (error) {
    console.log(error);
    await dbErrorHandling(error, context);
  }
};

const updatePlan = async (context) => {
  try {
    let plan = await Plan.update(
      {
        planName: context.input.planName,
        description: context.input.description,
        planNature: context.input.planNature,
        parentPlanId: context.input.parentPlanId,
        icon: context.input.icon,
        fDate: context.input.fDate,
        tDate: context.input.tDate,
        neededLogin: context.input.neededLogin,
      },
      { where: { planId: context.input.planId } }
    );

    if (plan[0] == [1]) {
      return setContextOutput(
        context,
        await Plan.findByPk(context.input.planId)
      );
    }
  } catch (error) {
    await dbErrorHandling(error, context);
  }
};

const loadPlan = async (context) => {
  try {
    let input = context.input;
    let query = {};
    if (input.planId) query.planId = input.planId;
    if (input.planName) query.planName = { [Op.like]: `%${input.planName}%` };
    if (input.planNature) query.planNature = input.planNature;
    if (input.parentPlanId === "null") {
      query.parentPlanId = null;
    } else if (input.parentPlanId) query.parentPlanId = input.parentPlanId;
    if (input.fDate) query.fDate = input.fDate;
    if (input.tDate) query.tDate = input.tDate;
    if (input.neededLogin) query.neededLogin = input.neededLogin;

    return setContextOutput(
      context,
      await Plan.findAll({
        where: query,
        include: {
          model: Plan,
          all: true,
          // required: true,
          include: {
            model: Plan,
            all: true,
            // required: true,
          },
        },
      })
    );
  } catch (error) {
    await dbErrorHandling(error, context);
  }
};

const loadPlanPaginate = async (context) => {
  try {
    let input = context.input;
    let offset = 20 * input.page;
    let query = {};
    if (input.planId) query.planId = input.planId;
    if (input.planName) query.planName = { [Op.like]: `%${input.planName}%` };
    if (input.planNature) query.planNature = input.planNature;
    if (input.parentPlanId) query.parentPlanId = input.parentPlanId;
    if (input.fDate) query.fDate = input.fDate;
    if (input.tDate) query.tDate = input.tDate;
    if (input.neededLogin) query.neededLogin = input.neededLogin;

    return setContextOutput(
      context,
      await Plan.findAndCountAll({
        where: query,
        include: {
          model: Plan,
          required: true,
          all: true,
          include: {
            model: Plan,
            required: true,
            all: true,
          },
        },
        limit: 20,
        skip: offset,
      })
    );
  } catch (error) {
    await dbErrorHandling(error, context);
  }
};

const loadPlanTree = async (context) => {
  try {
    let result = await db.sequelize.query(
      `WITH data AS( select array_to_json(array_agg(row_to_json(t))) as data from (SELECT "planId","description","parentPlanId", "planName","tDate", "fDate","neededLogin", COALESCE("PM".get_children("planId"), '[]') as children from "PM"."tblPlans" order by "planId" asc) t) SELECT "PM".get_tree(data) from data`
    );
    // result = await loadPlan(setContextInput(context, {}));
    //set middleware here

    return setContextOutput(context, result[0]); //result[0]
  } catch (error) {
    await dbErrorHandling(error, context);
  }
};

const loadPlanTreeAll = async (context) => {
  try {
    //TEST MIDDLEWARE

    const sunyarMidManager = context.sunyarMidManager;
    const args = {};

    context = loadMiddleware(
      context,
      "chaincodeName2",
      "tx",
      "GetAllAssets",
      args
    );

    await sunyarMidManager.send(context);

    //TEST MIDDLEWARE
    let plans = sunyarMidManager.response.value; //must get array
    plans = plans.map((p) => p.Record); //handle emty values!!!!!!!
    // plans = await loadPlan(context, {});
    // plans = plans.map((p) => p.Record); // you can put it in middleware outbound...whatever
    //processes all plans and their parents
    //find plans without parent roots[]
    //find plans that have parent_id of the root
    //loop above line untile you get null children
    //start next root
    //get all null_parent plans
    //test with planHashCode --> plan_id and parentHash --> parent_plan_id => DONE
    let root_plans = [];
    let modified_plans = [];
    let org_plans = {};

    // for (let plan of plans) {
    //   //modidy each plan?
    //   formatted_plans.push({});
    // }
    for (let plan of plans) {
      if (!plan.parentHash || plan.parentHash == "null") {
        root_plans.push(plan);
      }
    }
    // console.log("rooti", root_plans);
    // return
    for (let root_plan of root_plans) {
      root_plan.children = _helper_get_plans(plans, root_plan.planHashCode);
      modified_plans.push(root_plan); //delete it
      if (!org_plans[`${root_plan.OwnerOrgName}`]);
      {
        org_plans[`${root_plan.OwnerOrgName}`] = [];
      }
      org_plans[`${root_plan.OwnerOrgName}`].push(root_plan);
    }

    //set proper format for front
    return setContextOutput(context, org_plans); //[{ get_tree: modified_plans }]
  } catch (error) {
    console.log(error);
  }
};

const _helper_get_plans = (plans, parentHash) => {
  let children = [];
  let index = 0;
  for (let plan of plans) {
    if (plan.ParentPlanHashCode == parentHash) {
      children.push(plan);
      index = index++;
      children[index].children = _helper_get_plans(plans, plan.planHashCode);
    }
  }
  if (children.length == 0) {
    return [];
  }
  return children;
};
const getPlanByParentPlan = async (context) => {
  try {
    return setContextOutput(
      context,
      await Plan.findOne({ where: { parentPlanId: context.input.planId } })
    );
  } catch (error) {
    await dbErrorHandling(error, context);
  }
};

const deletePlan = async (context) => {
  try {
    return setContextOutput(
      context,
      await db.sequelize.transaction(async (t) => {
        let planT = await Plan.destroy({
          where: { planId: context.input.planId },
          transaction: t,
        });
        //TEST MIDDLEWARE
        const sunyarMidManager = context.sunyarMidManager;
        const args = {
          planHashCode: context.input.planHashCode,
        };
        context = loadMiddleware(
          context,
          "chaincodeName2",
          "tx",
          "DeleteAsset",
          args
        );
        await sunyarMidManager.send(context);
        planT.response = sunyarMidManager.response;
        return planT;
        //TEST MIDDLEWARE
      })
    );
  } catch (error) {
    await dbErrorHandling(error, context);
  }
};

module.exports = {
  createPlan,
  updatePlan,
  loadPlan,
  loadPlanPaginate,
  deletePlan,
  loadPlanTree,
  getPlanByParentPlan,
  loadPlanTreeAll,
};
