const db = require("../../../../config/dbIndex");
const {
  setContextOutput,
  setContextInput,
} = require("../../../../utility/logging");
const { dbErrorHandling } = require("../../../../utility/error/dbError");
const crypto = require("crypto-js");
const Op = require("sequelize").Op;
const { Sequelize } = require("sequelize");
var bcrypt = require("bcryptjs");
const Personal = db.tblPersonal;
const User = db.tblUser;
const {
  loadMiddleware,
} = require("../../../../utility/middleware/initMiddleware");

const getPersonInfo = async (context) => {
  try {
    return await setContextOutput(
      context,
      await Personal.findByPk(context.input.personId)
    );
  } catch (error) {
    console.log(error);
    await dbErrorHandling(error, context);
  }
};

const loadPersonal = async (context) => {
  try {
    if (context.input.personId) {
      return await setContextOutput(
        context,
        await Personal.findAll({ where: context.input })
      );
    } else {
      return await setContextOutput(
        context,
        await Personal.findAll({
          where: context.input,
          attributes: {
            exclude: ["personPhoto"],
          },
        })
      );
    }
  } catch (error) {
    console.log("HELL",error);
    await dbErrorHandling(error, context);
  }
};

const getPersonal = async (context) => {
  try {
    return await setContextOutput(
      context,
      await Personal.findOne({
        where: {
          nationalCode: context.input.nationalCode,
          personType: context.input.personType,
        },
      })
    );
  } catch (error) {
    await dbErrorHandling(error, context);
  }
};

const loadPersonalSearch = async (context) => {
  try {

    let input = context.input;
    let offset = 20 * parseInt(input.page);
    const query = {};
    if (input.name) query.name = { [Op.like]: `%${input.name}%` };
    if (input.family) query.family = { [Op.like]: `%${input.family}%` };
    if (input.nationalCode)
      query.nationalCode = { [Op.like]: `%${input.nationalCode}%` };
    if (input.sex) {
      if (input.sex === "true") query.sex = true;
      if (input.sex === "false") query.sex = false;
    }
    if (input.personType) query.personType = input.personType;

    if (input.isActive) {
      // if(input.isActive == "")
      query.isActive = input.isActive};
    return setContextOutput(
      context,
      await Personal.findAndCountAll({
        where: query,
        limit: 20,
        skip: offset,
      })
    );
  } catch (error) {
    await dbErrorHandling(error, context);
  }
};

const loadPersonalPersonType = async (context) => {
  try {
    if(context.params.IsActive == "true") context.input.isActive = true;
    context.input.personType = ["1", "3"];
    return await setContextOutput(
      context,
      await Personal.findAll({
        where: context.input,
        attributes: {
          exclude: ["personPhoto"],
        },
      })
    );
  } catch (error) {
    await dbErrorHandling(error, context);
  }
};

const loadPersonalPaginate = async (context) => {
  try {
    if (context.params.isActive == "true") {
      context.input.isActive = true;
    }

    let input = context.input;
    let offset = 12 * input.page;
    await delete context.input.page;
    return setContextOutput(
      context,
      await Personal.findAndCountAll({
        where: context.input,
        limit: 12,
        offset: offset,
        attributes: {
          exclude: ["personPhoto"],
        },
      })
    );
  } catch (error) {
    console.log(error);
    await dbErrorHandling(error, context);
  }
};

const createPersonal = async (context) => {
  try {
    context.input.secretCode = null;
    return setContextOutput(
      context,
      await db.sequelize.transaction(async (t) => {
        let personalT = await Personal.create(
          {
            name: context.input.name,
            family: context.input.family,
            nationalCode: context.input.nationalCode,
            idNumber: context.input.idNumber,
            sex: context.input.sex,
            birthDate: context.input.birthDate,
            birthPlace: context.input.birthPlace,
            personType: context.input.personType,
            personPhoto: context.input.personPhoto,
            secretCode: context.input.secretCode,
          },
          { transaction: t }
        );

        if (context.input.personType == 2 || context.input.personType == "2") {
          //TEST MIDDLEWARE
          const sunyarMidManager = context.sunyarMidManager;
          const args = {
            nationalCode: context.input.nationalCode,
            birthDate: context.input.birthDate,
            isActive: true,
          }; //cap???
          loadMiddleware(context, "chaincodeName1", "tx", "CreateBeneficiary", args);
          await sunyarMidManager.send(context);
          //TEST MIDDLEWARE
          const secretCode = sunyarMidManager.response.BeneficiaryHashCode;
          await Personal.update(
            {
              secretCode: secretCode,
            },
            {
              where: { personId: personalT.personId },
              transaction: t,
            }
          );
          personalT.dataValues.secretCode = sunyarMidManager.response.BeneficiaryHashCode;
        }
        return personalT.dataValues;
      })
    );
  } catch (error) {
    console.log(error);
    await dbErrorHandling(error, context);
  }
};

const crateTransaction = async (context) => {
  try {
    return setContextOutput(
      context,
      await db.sequelize.transaction(async (t) => {
        context.input.secretCode = null;

        let personalT = await Personal.create(
          {
            name: context.input.name,
            family: context.input.family,
            nationalCode: context.input.nationalCode,
            idNumber: context.input.idNumber,
            sex: context.input.sex,
            birthDate: context.input.birthDate,
            birthPlace: context.input.birthPlace,
            personType: context.input.personType,
            personPhoto: context.input.personPhoto,
            secretCode: context.input.secretCode,
          },
          { transaction: t }
        );

        const salt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(context.input.password, salt);

        const user = await User.create(
          {
            personId: personalT.dataValues.personId,
            username: context.input.username,
            password: hashPassword,
            expireDate: context.input.expireDate,
            active: context.input.active,
          },
          { transaction: t }
        );
        return user;
      })
    );
  } catch (error) {
    await dbErrorHandling(error, context);
  }
};

const updatePersonal = async (context) => {
  try {
    return setContextOutput(
      context,
      await db.sequelize.transaction(async (t) => {
        let updateResult = await Personal.update(
          {
            name: context.input.name,
            family: context.input.family,
            nationalCode: context.input.nationalCode,
            idNumber: context.input.idNumber,
            sex: context.input.sex,
            birthDate: context.input.birthDate,
            birthPlace: context.input.birthPlace,
            personType: context.input.personType,
            personPhoto: context.input.personPhoto,
            personPhoto: context.input.personPhoto,
            isActive: context.input.isActive,
          },
          { where: { personId: context.input.personId }, transaction: t }
        );
        //TEST MIDDLEWARE
        const beneficiaryHashCode = context.input.beneficiaryHashCode;
        const isActive = context.input.isActive;
        if (beneficiaryHashCode && isActive && context.input.personType == 2) {
          const args = {
            // beneficiaryHashCode,
            nationalCode,
            isActive,
          };
          context = loadMiddleware(
            context,
            "chaincodeName1",
            "tx",
            "UpdateAsset",
            args
          );
          await sunyarMidManager.send(context);
          //TEST MIDDLEWARE
        }
        if (updateResult[0] == 1) {
          return await setContextOutput(
            context,
            await Personal.findByPk(context.input.personId)
          );
        }
      })
    );
  } catch (error) {
    await dbErrorHandling(error, context);
  }
};
/*

*/
const deletePersonal = async (context) => {
  try {
    return await setContextOutput(
      context,
      await db.sequelize.transaction(async (t) => {
        // let deleteResultT = await Personal.update(
        //   {
        //     isActive: false,
        //   },
        //   {
        //     where: { personId: context.input.personId },
        //     transaction: t,
        //   }
        // );
        deleteResultT = await Personal.destroy({
          where: { personId: context.input.personId },
          transaction: t,
        });
        //TEST MIDDLEWARE
        const person = context.input.person;
        const sunyarMidManager = context.sunyarMidManager;
        if (person.secretCode && person.personType == 2) {
          const args = {
            beneficiaryHashCode: person.secretCode,
            // nationalCodeInput: person.nationalCode, 
            // birthDateInput: person.birthDate,
            // IsActive: false,
          };
          context = loadMiddleware(
            context,
            "chaincodeName1",
            "tx",
            "DeleteAsset",
            args
          );
          await sunyarMidManager.send(context);
        }
        //TEST MIDDLEWARE

        return deleteResultT;
      })
    );
  } catch (error) {
    console.log("khata",error);
    await dbErrorHandling(error, context);
  }
};
// ---- sari task -------------------------------------------

const isPersonExistsById = async (context) => {
  try {
    return setContextOutput(
      context,
      await Personal.findOne({ where: { personId: context.input.personId } })
    );
  } catch (error) {
    await dbErrorHandling(error, context);
  }
};

module.exports = {
  createPersonal,
  updatePersonal,
  loadPersonal,
  deletePersonal,
  loadPersonalPersonType,
  isPersonExistsById,
  loadPersonalPaginate,
  loadPersonalSearch,
  getPersonal,
  crateTransaction,
  getPersonInfo,
};
