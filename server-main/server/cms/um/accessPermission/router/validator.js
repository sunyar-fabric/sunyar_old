const Joi = require('joi');

const validateCreateSystemForm = async (body, language) => {
  var schema = Joi.object().keys({
    faForm: Joi.string().required().min(1).max(500).messages({
      'string.base': `نوع ورودی صحیح نمی‌باشد`,
      'string.empty': `نام فارسی فرم اجباری است`,
      'string.max': `تعداد کارکترهای فرم بیش از حد مجاز است`,
      'any.required': `نام فرم اجباری است`
    }),
    enForm: Joi.string().required().min(1).max(500).messages({
      'string.base': `نوع ورودی صحیح نمی‌باشد`,
      'string.empty': `نام انگلیسی فرم اجباری است`,
      'string.max': `تعداد کارکترهای فرم بیش از حد مجاز است`,
      'any.required': `نام فرم اجباری است`
    }),
    sysKind: Joi.boolean().messages({
      'boolean.base': `نوع ورودی صحیح نمی‌باشد`,
    }),
    sysParentId: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`,
      'number.empty': `شناسه پدر اجباری است`,
      'any.required': `شناسه پدر اجباری است`
    })
  });
  var schemaEn = Joi.object().keys({
    faForm: Joi.string().required().min(1).max(500),
    enForm: Joi.string().required().min(1).max(500),
    sysKind: Joi.boolean(),
    sysParentId: Joi.number().integer().required()
  });
  schema = language.en? schemaEn: schema;
  return schema.validate(body);
};


const validateUpdateSystemForm = async (body, systemFormId, language) => {
  body.systemFormId = systemFormId;
  var schema = Joi.object().keys({
    systemFormId: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`,
      'number.empty': `شناسه فرم اجباری است`,
      'any.required': `شناسه فرم اجباری است`
    }),
    faForm: Joi.string().required().min(1).max(500).messages({
      'string.base': `نوع ورودی صحیح نمی‌باشد`,
      'string.empty': `نام فارسی فرم اجباری است`,
      'string.max': `تعداد کارکترهای فرم بیش از حد مجاز است`,
      'any.required': `نام فرم اجباری است`
    }),
    enForm: Joi.string().required().min(1).max(500).messages({
      'string.base': `نوع ورودی صحیح نمی‌باشد`,
      'string.empty': `نام انگلیسی فرم اجباری است`,
      'string.max': `تعداد کارکترهای فرم بیش از حد مجاز است`,
      'any.required': `نام فرم اجباری است`
    }),
    sysKind: Joi.boolean().messages({
      'boolean.base': `نوع ورودی صحیح نمی‌باشد`,
    }),
    sysParentId: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`,
      'number.empty': `شناسه پدر اجباری است`,
      'any.required': `شناسه پدر اجباری است`
    })
  });
  var schemaEn = Joi.object().keys({
    systemFormId: Joi.number().integer().required(),
    faForm: Joi.string().required().min(1).max(500),
    enForm: Joi.string().required().min(1).max(500),
    sysKind: Joi.boolean(),
    sysParentId: Joi.number().integer().required()
  });
  schema = language.en? schemaEn: schema;
  return schema.validate(body);
};


const validateLoadSystemForm = async (query, language) => {
  var schema = Joi.object().keys({
    systemFormId: Joi.number().integer().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`
    }),
    faForm: Joi.string().min(1).max(500).messages({
      'string.base': `نوع ورودی صحیح نمی‌باشد`,
      'string.max': `تعداد کارکترهای فرم بیش از حد مجاز است`,
      'string.empty': `نوع ورودی صحیح نمی‌باشد`
    }),
    enForm: Joi.string().min(1).max(500).messages({
      'string.base': `نوع ورودی صحیح نمی‌باشد`,
      'string.max': `تعداد کارکترهای فرم بیش از حد مجاز است`
    }),
    sysKind: Joi.boolean().messages({
      'boolean.base': `نوع ورودی صحیح نمی‌باشد`,
    }),
    sysParentId: Joi.number().integer().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`
    })
  });
  var schemaEn = Joi.object().keys({
    systemFormId: Joi.number().integer(),
    faForm: Joi.string().min(1).max(500),
    enForm: Joi.string().min(1).max(500),
    sysKind: Joi.boolean(),
    sysParentId: Joi.number().integer()
  });
  schema = language.en? schemaEn: schema;
  return schema.validate(query);
}

const validateDeleteSystemForm = async (params, language) => {
  var schema = Joi.object().keys({
    systemFormId: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`,
      'number.empty': `شناسه فرم اجباری است`,
      'any.required': `شناسه فرم اجباری است`
    })
  });
  var schemaEn = Joi.object().keys({
    systemFormId: Joi.number().integer().required()
  });
  schema = language.en? schemaEn: schema;
  return schema.validate(params);
}

const validateAssignPermissionToRole = async (body, language) => {
  var schema = Joi.object().keys({
    systemFormId: Joi.number().integer().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`,
      'number.empty': `شناسه فرم اجباری است`,
      'any.required': `شناسه فرم اجباری است`
    }),
    roleId: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`,
      'number.empty': `شناسه نقش اجباری است`,
      'any.required': `شناسه نقش اجباری است`
    }),
    hasAccess: Joi.boolean().messages({
      'boolean.base': `نوع ورودی صحیح نمی‌باشد`,
    }),
  });
  var schemaEn = Joi.object().keys({
    systemFormId: Joi.number().integer(),
    roleId: Joi.number().integer().required(),
    hasAccess: Joi.boolean(),
  });
  schema = language.en? schemaEn: schema;
  return schema.validate(body);
};

const validateLoadPermission = async (body, language) => {
  var schema = Joi.object().keys({
    assignRoleToSystemFormId: Joi.number().integer().messages({
      'number.base': `نوع شناسه مجوزدسترسی صحیح نمی‌باشد`
    }),
    systemFormId: Joi.number().integer().messages({
      'number.base': `نوع شناسه فرم صحیح نمی‌باشد`
    }),
    roleId: Joi.number().integer().messages({
      'number.base': `نوع شناسه نقش صحیح نمی‌باشد`
    }),
    hasAccess: Joi.boolean().messages({
      'boolean.base': `نوع ورودی صحیح نمی‌باشد`,
    })
  });
  var schemaEn = Joi.object().keys({
    assignRoleToSystemFormId: Joi.number().integer(),
    systemFormId: Joi.number().integer(),
    roleId: Joi.number().integer(),
    hasAccess: Joi.boolean()
  });
  schema = language.en? schemaEn: schema;
  return schema.validate(body);
};


const validateDeletePermission = async (body, language) => {
  var schema = Joi.object().keys({
    systemFormId: Joi.number().integer().messages({
      'number.base': `نوع شناسه فرم صحیح نمی‌باشد`
    }),
    roleId: Joi.number().integer().messages({
      'number.base': `نوع شناسه نقش صحیح نمی‌باشد`
    }),
  });
  var schemaEn = Joi.object().keys({
    systemFormId: Joi.number().integer(),
    roleId: Joi.number().integer(),
  });
  schema = language.en? schemaEn: schema;
  return schema.validate(body);
}

module.exports = {
  validateCreateSystemForm, validateUpdateSystemForm, validateLoadSystemForm, validateDeleteSystemForm,
  validateAssignPermissionToRole, validateLoadPermission, validateDeletePermission
};