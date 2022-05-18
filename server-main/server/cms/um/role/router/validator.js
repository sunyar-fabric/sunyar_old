const Joi = require('joi');

/////-------------- Role Validator ----------------------------------------
const validateCreateRole = async (body) => {
  var schema = Joi.object().keys({
    faName: Joi.string().required().min(1).max(20).messages({
      'string.base': `نوع ورودی صحیح نمی‌باشد`,
      'string.empty': `نام فارسی نقش اجباری است`,
      'string.max': `تعداد کارکترهای نقش بیش از حد مجاز است`,
      'any.required': `نام نقش اجباری است`
    }),
    enName: Joi.string().required().min(1).max(20).messages({
      'string.base': `نوع ورودی صحیح نمی‌باشد`,
      'string.empty': `نام انگلیسی نقش اجباری است`,
      'string.max': `تعداد کارکترهای نقش بیش از حد مجاز است`,
      'any.required': `نام نقش اجباری است`
    })
  });
  var schemaEn = Joi.object().keys({
    faName: Joi.string().required().min(1).max(20),
    enName: Joi.string().required().min(1).max(20)
  });
  schema = language.en? schemaEn: schema;
  return schema.validate(body);
};

const validateUpdateRole = async (body, roleId, language) => {
  body.roleId = roleId;
  var schema = Joi.object().keys({
    roleId: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`,
      'number.empty': `شناسه نقش اجباری است`,
      'any.required': `شناسه نقش اجباری است`
    }),
    faName: Joi.string().required().min(1).max(20).messages({
      'string.base': `نوع ورودی صحیح نمی‌باشد`,
      'string.empty': `نام فارسی نقش اجباری است`,
      'string.max': `تعداد کارکترهای نقش بیش از حد مجاز است`,
      'any.required': `نام نقش اجباری است`
    }),
    enName: Joi.string().required().min(1).max(20).messages({
      'string.base': `نوع ورودی صحیح نمی‌باشد`,
      'string.empty': `نام انگلیسی نقش اجباری است`,
      'string.max': `تعداد کارکترهای نقش بیش از حد مجاز است`,
      'any.required': `نام نقش اجباری است`
    })
  });
  var schemaEn = Joi.object().keys({
    roleId: Joi.number().integer().required(),
    faName: Joi.string().required().min(1).max(20),
    enName: Joi.string().required().min(1).max(20)
  });
  schema = language.en? schemaEn: schema;
  return schema.validate(body);
};

const validateLoadRole = async (query, language) => {
  var schema = Joi.object().keys({
    roleId: Joi.number().integer().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`

    }),
    faName: Joi.string().min(1).max(20).messages({
      'string.base': `نوع نام فارسی نقش صحیح نمی‌باشد`
    }),
    enName: Joi.string().min(1).max(20).messages({
      'string.base': `نوع نام انگلیسی نقش صحیح نمی‌باشد`
    })
  });
  var schemaEn = Joi.object().keys({
    roleId: Joi.number().integer(),
    faName: Joi.string().min(1).max(20),
    enName: Joi.string().min(1).max(20)
  });
  schema = language.en? schemaEn: schema;
  return schema.validate(query);
}

const validateDeleteRole = async (params, language) => {
  var schema = Joi.object().keys({
    roleId: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`,
      'number.empty': `شناسه نقش اجباری است`,
      'any.required': `شناسه نقش اجباری است`
    })
  });
  var schemaEn = Joi.object().keys({
    roleId: Joi.number().integer().required()
  });
  schema = language.en? schemaEn: schema;
  return schema.validate(params);
}

/////-------------- AssignRoleToUSer Validator ----------------------------------------

const validateAssignRoleToUser = async (body, language) => {
  var schema = Joi.object().keys({
    userId: Joi.number().integer().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`,
      'number.empty': `ورودی اجباری است`,
      'any.required': `ورودی اجباری است`
    }),
    roleId: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`,
      'number.empty': `شناسه نقش اجباری است`,
      'any.required': `شناسه نقش اجباری است`
    })
  });
  var schema = Joi.object().keys({
    userId: Joi.number().integer(),
    roleId: Joi.number().integer().required()
  });
  schema = language.en? schemaEn: schema;
  return schema.validate(body);
};

const validateLoadAssignRoleToUser = async (body, language) => {
  var schema = Joi.object().keys({
    assignRoleToUserId: Joi.number().integer().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`,
    }),
    userId: Joi.number().integer().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`,
    }),
    roleId: Joi.number().integer().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`,
    })
  });
  var schemaEn = Joi.object().keys({
    assignRoleToUserId: Joi.number().integer(),
    userId: Joi.number().integer(),
    roleId: Joi.number().integer()
  });
  schema = language.en? schemaEn: schema;
  return schema.validate(body);
};

const validateDeleteRolesFromUser = async (params, language) => {
  var schema = Joi.object().keys({
    assignRoleToUserId: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`,
      'number.empty': `ورودی اجباری است`,
      'any.required': `ورودی اجباری است`
    })
  });
  var schemaEn = Joi.object().keys({
    assignRoleToUserId: Joi.number().integer().required()
  });
  schema = language.en? schemaEn: schema;
  return schema.validate(params);
}

module.exports = {
  validateCreateRole, validateUpdateRole, validateLoadRole, validateDeleteRole,
  validateAssignRoleToUser, validateLoadAssignRoleToUser, validateDeleteRolesFromUser
}