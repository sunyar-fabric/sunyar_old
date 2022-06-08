const router = require("express").Router();
const { createError } = require("../../../../utility/error/errorHandling");
const {
  wsCreatePersonal,
  wsUpdatePersonal,
  wsLoadPersonal,
  wsDeletePersonal,
  wsLoadPersonalPersonType,
  wsLoadPersonalPaginate,
  wsLoadPersonalSearch,
  wsCreatePersonalAccount,
} = require("../compositeServices/personal");
const {
  validateCreatePersonal,
  validateCreateNeedy,
  validateUpdateNeedy,
  validateUpdatePersonal,
  validateDeletePersonal,
  validateLoadPersonal,
} = require("./validator");
const english_digit = require("../../../../utility/fnChangeFarsiNumber");
const {
  authorizeRequest,
} = require("../../jwt/compositeServices/authorization");

router.get(
  "/",
  (req, _, next) => authorizeRequest(req, ["AID", "ACCOUNTANT"], next),
  async (req, res, next) => {
    try {
      const { error } = await validateLoadPersonal(req.query, req.language);
      if (error) {
        const { details } = error;
        const message = details.map((i) => i.message).join(",");
        throw createError(
          { code: 1, message: message, httpStatusCode: 400 },
          req.context
        );
      }
      req.context.params = req.query;
      req.context = await wsLoadPersonal(req.context);
      res.json(req.context.result);
      next();
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/personalSearch",
  (req, _, next) => authorizeRequest(req, ["AID"], next),
  (req, _, next) => authorizeRequest(req, "AID", next),
  async (req, res, next) => {
    try {
      const { page, name, family, nationalCode, sex, personType, isActive } = req.query;
      req.context.params = {
        page,
        name,
        family,
        nationalCode,
        sex,
        personType,
        isActive
      };
      req.context = await wsLoadPersonalSearch(req.context);
      res.set("count", req.context.count).json(req.context.result);
      next();
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/personal1",
  (req, _, next) => authorizeRequest(req, ["AID"], next),
  async (req, res, next) => {
    try {
      if (req.query.personType != null) {
        delete req.query.personType;
      }
      const { error } = await validateLoadPersonal(req.query, req.language);
      if (error) {
        const { details } = error;
        const message = details.map((i) => i.message).join(",");
        throw createError(
          { code: 1, message: message, httpStatusCode: 400 },
          req.context
        );
      }

      req.context.params = req.query;
      req.context = await wsLoadPersonalPersonType(req.context);
      res.json(req.context.result);
      next();
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/personalPagination",
  (req, _, next) => authorizeRequest(req, ["AID"], next),
  async (req, res, next) => {
    try {
      const { error } = await validateLoadPersonal(req.query, req.language);
      if (error) {
        const { details } = error;
        const message = details.map((i) => i.message).join(",");
        throw createError(
          { code: 1, message: message, httpStatusCode: 400 },
          req.context
        );
      }

      req.context.params = req.query;
      req.context = await wsLoadPersonalPaginate(req.context);
      res.set("count", req.context.count).json(req.context.result);
      next();
    } catch (error) {
      next(error);
    }
  }
);

//(req, _, next) => authorizeRequest(req, ["AID"], next)
router.post(
  "/",
  async (req, res, next) => {
    try {
      let errorHandling = {}
      switch (true) {
          case (req.body.personType == 2):
              errorHandling = await validateCreateNeedy(req.body, req.language)
              break;
          default:
              errorHandling = await validateCreatePersonal(req.body, req.language)
              break;
      }
      if (errorHandling.error) {
          const { details } = errorHandling.error;
          const message = details.map(i => i.message).join(',');
          throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
      }

      const {
        name,
        family,
        nationalCode,
        idNumber,
        sex,
        birthDate,
        birthPlace,
        personType,
        personPhoto,
      } = req.body;

      req.context.params = {
        name,
        family,
        nationalCode,
        idNumber,
        sex,
        birthDate,
        birthPlace,
        personType,
        personPhoto,
      };
      req.context = await wsCreatePersonal(req.context);
      res.json(req.context.result);
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.put(
  "/:personId",
  (req, _, next) => authorizeRequest(req, ["AID"], next),
  async (req, res, next) => {
    try {
      req.body.personId = req.params.personId;
      let errorHandling = {};
      switch (true) {
        case req.body.personType == 2:
          errorHandling = await validateUpdateNeedy(req.body, req.language);
          break;
        default:
          errorHandling = await validateUpdatePersonal(req.body, req.language);
          break;
      }

      if (errorHandling.error) {
        const { details } = errorHandling.error;
        const message = details.map((i) => i.message).join(",");
        throw createError(
          { code: 1, message: message, httpStatusCode: 400 },
          req.context
        );
      }
      const {
        personId,
        name,
        family,
        nationalCode,
        idNumber,
        sex,
        birthDate,
        birthPlace,
        personType,
        personPhoto,
        isActive,
      } = req.body;

      req.context.params = {
        personId,
        name,
        family,
        nationalCode,
        idNumber,
        sex,
        birthDate,
        birthPlace,
        personType,
        personPhoto,
        isActive,
      };
      req.context = await wsUpdatePersonal(req.context);
      res.json(req.context.result);
      next();
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:personId",
  (req, _, next) => authorizeRequest(req, ["AID"], next),
  async (req, res, next) => {
    try {
      const { error } = await validateDeletePersonal(req.params, req.language);
      if (error) {
        const { details } = error;
        const message = details.map((i) => i.message).join(",");
        throw createError(
          { code: 1, message: message, httpStatusCode: 400 },
          req.context
        );
      }
      const personId = req.params;
      req.context.params = personId;

      req.context = await wsDeletePersonal(req.context);
      res.json(req.context.result);
      next();
    } catch (error) {
      next(error);
    }
  }
);

//------------------------------------------------------------------------------------
//(req, _, next) => authorizeRequest(req, 'AID', next)
router.post("/personalAccount", async (req, res, next) => {
  try {
    // const { error } = await validateCreateUserPersonal(req.body)
    // if (error) {
    //     const { details } = error;
    //     const message = details.map(i => i.message).join(',');
    //     throw createError({ code: 1, message: message, httpStatusCode: 400 }, req.context);
    // }

    const {
      name,
      family,
      nationalCode,
      sex,
      personType,
      username,
      password,
      expireDate,
      active,
    } = req.body;
    req.context.params = {
      name,
      family,
      nationalCode,
      sex,
      personType,
      username,
      password,
      expireDate,
      active,
    };
    req.context = await wsCreatePersonalAccount(req.context);
    res.json(req.context.result);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
