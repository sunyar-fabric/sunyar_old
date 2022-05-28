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

const MORI_PLANS = [
  {
      "Key": "0712e62b-7402-4d1f-9c4b-b56a272d391e",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "c9e2b84d5ae3aaa9e137ae9f391bcfa2fa178ed222bc85c6300d737941877aee",
          "PlanName": "plan-17"
      }
  },
  {
      "Key": "072e1659-7483-49f4-8b40-56fc6f5aa6df",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "76136c918919a2d810513391bcd5f49db1c970f012736673df870651e67f0d8e",
          "PlanName": "plan-15"
      }
  },
  {
      "Key": "0d2b5c96-a145-4812-bf19-0a8a557d6a86",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "c9e2b84d5ae3aaa9e137ae9f391bcfa2fa178ed222bc85c6300d737941877aee",
          "PlanName": "plan-17"
      }
  },
  {
      "Key": "1d0ad051-efde-4f92-822a-b8bc1d62f194",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "0dbf21d0a20f5f24e2cfc575dcfb598d7c1695b8c76a4e3030e49ca96d9499d8",
          "PlanName": "plan-13"
      }
  },
  {
      "Key": "1e7c1426-9c77-44bf-b631-eb44cf615a3c",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "96b509b29b4380a7976c7660f52bb82d133b42b5224f9a1cec05e8f7fb1696ab",
          "PlanName": "plan-8"
      }
  },
  {
      "Key": "25af433e-3da9-40ca-bf4e-71424d6223aa",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "0509e94135010d2fa47335e7dd8ae9701e86d14b7d26b1afb3bc9a347b143f3e",
          "PlanHashCode": "d42d67fbd8c4199902fa2f7fdf9b51b271c6700506fc828537aba720616f06f0",
          "PlanName": "plan-32"
      }
  },
  {
      "Key": "2704f611-e2c9-42b8-8936-6c8c6dfc5344",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "e794c6c13a8d5ccd43d454c33f65625815f3e7d95c28a1cdd7dc3dd2646f2fe2",
          "PlanName": "plan-16"
      }
  },
  {
      "Key": "32f34188-fc51-4d18-bb6f-6e399fa8b3e6",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "4f1e41c229ee2f627f6b6008992b13798333e036ab4c2056b15cc7d308457a54",
          "PlanName": "plan-22"
      }
  },
  {
      "Key": "3f90c1c1-9a9a-46e0-9c50-978a38c20e84",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "98b94bf9f4cb4570a3329dc571c029193647607b5264e4e6974bce596ea004fa",
          "PlanName": "plan-12"
      }
  },
  {
      "Key": "55e1f3e0-0ca6-4080-adcb-458907d81299",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "51fafedbb0c1e96815ca07c3fdf95d6ccd5006441d12a5a7fcca16ba389fa2ea",
          "PlanName": "plan-14"
      }
  },
  {
      "Key": "670bc9e7-e27e-43eb-bd4d-d892a91feb76",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "64bb6430a202a8fedde6658cfa07e1987e23e0fed2b36e508d3d58096ae9b476",
          "PlanName": "plan-28"
      }
  },
  {
      "Key": "677c1589-2046-42e1-95b5-9a5ddd1be977",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "0288d369b54c233e812d274897e96d6482a292edb977a3aaa61c61191a783097",
          "PlanName": "plan-10"
      }
  },
  {
      "Key": "6a639358-0a2c-4424-9464-e92cd3c35a5c",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "8b7abfa8f492ad2a6bf509a584e29e5dec2f3a617303978c856153cc292e7d7e",
          "PlanName": "plan-19"
      }
  },
  {
      "Key": "6eb240cf-2d2d-4050-a484-7751c456ce28",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org3MSP",
          "ParentPlanHashCode": "d42d67fbd8c4199902fa2f7fdf9b51b271c6700506fc828537aba720616f06f0",
          "PlanHashCode": "d8760fa2308639124126d8a0252e7096dd076861dfc8cbdbeb620925a4aeb7b6",
          "PlanName": "plan-34"
      }
  },
  {
      "Key": "6ff7dc3e-448b-4c1c-b50c-469c04314bcd",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "d63686bd66bc947dd11e154dda3af6a56eb164d81f4e43d11c1f5ea0a73491f9",
          "PlanName": "plan-23"
      }
  },
  {
      "Key": "75d507ca-1e81-4551-aee4-b5fb43922bbd",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "d42d67fbd8c4199902fa2f7fdf9b51b271c6700506fc828537aba720616f06f0",
          "PlanHashCode": "77a6c992002b8c8b2503601d6e724e3be213836a07c8c8e203f03cffb78af8c1",
          "PlanName": "plan-33"
      }
  },
  {
      "Key": "7a7b165e-650b-422a-9ccc-0fd38b1c7ed4",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "17d5465190d2ced14cd23f8d6d77957359e507d3c7ab9eeb594609db4cfe66c0",
          "PlanName": "plan-21"
      }
  },
  {
      "Key": "845a7161-ebf4-4164-a677-97bc0bb519a5",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "c9e2b84d5ae3aaa9e137ae9f391bcfa2fa178ed222bc85c6300d737941877aee",
          "PlanName": "plan-17"
      }
  },
  {
      "Key": "8973673a-f331-4640-a7f6-f4342ff114aa",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org3MSP",
          "ParentPlanHashCode": "d42d67fbd8c4199902fa2f7fdf9b51b271c6700506fc828537aba720616f06f0",
          "PlanHashCode": "4d6dbb16e61d526c6d0fa665c1c023f8ac8411123cb58ce29027a0a8fec014b3",
          "PlanName": "plan-35"
      }
  },
  {
      "Key": "8e331e6c-b389-4bba-aff2-e9f8ff66f0fe",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "32f28248e0dae6c0d5a060682004377d46e98e2b751da6db6e3cb8023164c41f",
          "PlanName": "plan-5"
      }
  },
  {
      "Key": "91f9cd97-5f05-4966-92ac-de18b930e7f2",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "c9e2b84d5ae3aaa9e137ae9f391bcfa2fa178ed222bc85c6300d737941877aee",
          "PlanName": "plan-17"
      }
  },
  {
      "Key": "92767148-2f4f-4e25-a9e3-221bb3a9a866",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "4c3ffb7d1b495b726ae79a2aa65d911580d17e993751939cd6caa02e0abc833d",
          "PlanName": "plan-25"
      }
  },
  {
      "Key": "976f1c55-3732-47b9-bbbc-a22b43c4b29d",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org3MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "440bdc62d935e5d928ec24edef17018bb95c60d97dc17499d057e599395841ca",
          "PlanName": "plan-36"
      }
  },
  {
      "Key": "980b9d78-ee9d-4629-82ad-47306f23753a",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "77399fd888a944cdce44c03ad8b94590fe60e9469e56d17bb4a5fa7683bef68e",
          "PlanName": "plan-6"
      }
  },
  {
      "Key": "98a60dc2-1cd8-4d2e-a2dd-d4b4c9902cb7",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "979309e3221fb514e4792a1bee33342f3b6f127a7e48a9f0a69d0b29f18ef815",
          "PlanName": "plan-18"
      }
  },
  {
      "Key": "9d717359-140c-46f9-bd0c-3808e592515e",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "e6dc9eb13d06b900d469fd2d0ce550458044559fe8162e20db1e6027c66dec63",
          "PlanName": "plan-20"
      }
  },
  {
      "Key": "c6148a5f-6282-4606-a0b1-cb1427038d71",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "5aeda6c649d15898b528df7074996743adea6898ad784f91b577444d724892ff",
          "PlanName": "plan-26"
      }
  },
  {
      "Key": "d005395a-25a5-45ae-b70c-c1c1ff9c4344",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "0509e94135010d2fa47335e7dd8ae9701e86d14b7d26b1afb3bc9a347b143f3e",
          "PlanHashCode": "ec53d72e650cfc24b27550d25c3baa81c58fd942f9519e953031be79efef478e",
          "PlanName": "plan-31"
      }
  },
  {
      "Key": "dc47579a-f62a-4dbb-a936-3661ec4d3826",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org3MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "182756fbe1b455e35daca8733f63d4feb7eccc213ce20df35066e5b4be5f2377",
          "PlanName": "plan-37"
      }
  },
  {
      "Key": "df3135bb-394d-41ee-ad66-972c31e63881",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "693e51bca1338955fb5ab3fc951ef35ea1eef5e456a51f1bf1016788ab8c8f95",
          "PlanName": "plan-27"
      }
  },
  {
      "Key": "e1191ae9-32cc-4ec3-a04f-6a6043d58453",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "31a57eed593637afca5f44a2566f83b8e8961f4580128d328df81d025a6ec670",
          "PlanName": "plan-9"
      }
  },
  {
      "Key": "e143c90e-980e-413b-9212-76dc738614a6",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "291184bee1d157272a3229d4df0ff2ef85e168bc89123bff6b38c3c32fc5b5d8",
          "PlanName": "plan-7"
      }
  },
  {
      "Key": "e883d35c-0469-4893-a2e8-eceded08e3c0",
      "Record": {
          "DurationDate": 10609990200000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "0509e94135010d2fa47335e7dd8ae9701e86d14b7d26b1afb3bc9a347b143f3e",
          "PlanName": "plan-30"
      }
  },
  {
      "Key": "f98efca7-eaa4-40a1-959e-b35fd9bbcd8f",
      "Record": {
          "DurationDate": 9600150600000,
          "OwnerOrgName": "Org2MSP",
          "ParentPlanHashCode": "null",
          "PlanHashCode": "15efd906d0fa85e5e7718a7e105e08c0b1f2b2659c4d87617222eabd8a67d5ae",
          "PlanName": "plan-11"
      }
  }
];
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
            ownerOrgName: context.charityConfig.orgMSP, //
            durationDate: context.input.tDate, //[context.input.fDate, context.input.tDate]
            parentPlanHashCode: context.input.parentPlanHashCode?context.input.parentPlanHashCode:"null",
          };
          context = loadMiddleware(
            context,
            "chaincodeName2",
            "tx",
            "CreatePlan",
            args
          );
          await sunyarMidManager.send(context);
          Plan.update(
            {
              planHashCode: sunyarMidManager.response?.PlanHashCode,
            },
            {
              where: { planId: planT.planId },
            }
          );
        }
        planT.planHashCode = sunyarMidManager.response?.PlanHashCode;
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
      "GetAllPlans",
      args
    );

    
    // await sunyarMidManager.send(context); //i will uncomment you
  
    //TEST MIDDLEWARE
    let plans = sunyarMidManager.response; //must get array //depends on sdk API just for test keep it like this
    plans = MORI_PLANS;  //i will remove you
    plans = plans.map((p) => p.Record); //handle emty values!!!!!!!
    
    //processes all plans and their parents
    //find plans without parent roots[]
    //find plans that have parent_id of the root
    //loop above line untile you get null children
    //start next root
    //get all null_parent plans
    //test with planHashCode --> plan_id and parentHash --> parent_plan_id => DONE
    let root_plans = [];
    let org_plans = {};
    // for (let plan of plans) {
    //   //modidy each plan?
    //   formatted_plans.push({});
    // }
    for (let plan of plans) {
      if (!plan.ParentPlanHashCode || plan.ParentPlanHashCode == "null") {
        root_plans.push(plan);
      }
    }


    for (let root_plan of root_plans) {
      root_plan.children = _helper_get_plans(plans, root_plan.PlanHashCode);
      // modified_plans.push(root_plan); //delete it
      if(org_plans[`${root_plan.OwnerOrgName}`] === undefined){
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
      children[index].children = _helper_get_plans(plans, plan.PlanHashCode);
      ++index
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
