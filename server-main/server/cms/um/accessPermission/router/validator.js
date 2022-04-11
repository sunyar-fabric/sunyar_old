const Joi = require('joi');

/////-------------- System Form Validator ----------------------------------------

const validateCreateSystemForm = async (body) => {
  const schema = Joi.object().keys({
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
  return schema.validate(body);
};


const validateUpdateSystemForm = async (body, systemFormId) => {
  body.systemFormId = systemFormId;
  const schema = Joi.object().keys({
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
  return schema.validate(body);
};


const validateLoadSystemForm = async (query) => {
  const schema = Joi.object().keys({
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
  return schema.validate(query);
}

const validateDeleteSystemForm = async (params) => {
  const schema = Joi.object().keys({
    systemFormId: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`,
      'number.empty': `شناسه فرم اجباری است`,
      'any.required': `شناسه فرم اجباری است`
    })
  });
  return schema.validate(params);
}

/////-------------- Access Permission Validator ----------------------------------------

const validateAssignPermissionToRole = async (body) => {
  const schema = Joi.object().keys({
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
  return schema.validate(body);
};

const validateLoadPermission = async (body) => {
  const schema = Joi.object().keys({
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
  return schema.validate(body);
};


const validateDeletePermission = async (body) => {
  const schema = Joi.object().keys({
    systemFormId: Joi.number().integer().messages({
      'number.base': `نوع شناسه فرم صحیح نمی‌باشد`
    }),
    roleId: Joi.number().integer().messages({
      'number.base': `نوع شناسه نقش صحیح نمی‌باشد`
    }),
  });
  return schema.validate(body);
}

module.exports = {
  validateCreateSystemForm, validateUpdateSystemForm, validateLoadSystemForm, validateDeleteSystemForm,
  validateAssignPermissionToRole, validateLoadPermission, validateDeletePermission
};