const Joi = require('joi');





///////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////// personal validation /////////////////////////////////////////////////////////////////////
const validateLoadPersonal = async (body) => {

  const schema = Joi.object().keys({
    page: Joi.number().integer().messages({
      'number.base': `ورودی صفحه صحیح نمی‌باشد`,
    }).allow('null', null),
    personId: Joi.number().integer().messages({
      'number.base': `نوع ورودی شناسه شخص صحیح نمی‌باشد`,
    }).allow('null', null),
    name: Joi.string().min(1).max(500).messages({
      'string.base': `نوع ورودی نام صحیح نمی‌باشد`,
      'string.max': `تعداد کارکترهای نام بیش از حد مجاز است`,
    }),
    family: Joi.string().min(1).max(500).messages({
      'string.base': `نوع ورودی نام‌خانوادگی صحیح نمی‌باشد`,
      'string.max': `تعداد کارکترهای نام‌خانوادگی بیش از حد مجاز است`,
    }),
    // mobileNumber: Joi.string()
    //     .regex(/^[0-9]{12}$/)
    //     .custom((value, helper) => {
    //         if (parseInt(value) > 989000000000 && parseInt(value) < 989999999999) return true;
    //         return helper.message("شماره موبایل نادرست است");
    //     }),
    nationalCode: Joi.string()
      .custom((value, helper) => {
        if (value) {
          if (value.length < 8 || parseInt(value, 10) == 0) return helper.message("کد ملی نادرست است")
          value = ('0000' + value).substr(value.length + 4 - 10);
          if (parseInt(value.substr(3, 6), 10) == 0) return helper.message("کد ملی نادرست است")
          if (value.length == 10) {
            if (value == '1111111111' || value == '0000000000' || value == '2222222222' ||
              value == '3333333333' || value == '4444444444' || value == '5555555555' ||
              value == '6666666666' || value == '7777777777' || value == '8888888888' ||
              value == '9999999999') {
              return helper.message("کد ملی نادرست است");
            }
            let c = parseInt(value.charAt(9));
            let n = 0;
            for (let i = 0; i < 9; i++) {
              n += parseInt(value.charAt(i)) * (10 - i)
            }
            r = n - parseInt(n / 11) * 11;
            if ((r == 0 && r == c) || (r == 1 && c == 1) || (r > 1 && c == 11 - r)) {
              return true;
            } else {
              return helper.message("کد ملی نادرست است");
            }
          } else return true;
        } else return true;
      }).messages({
        'string.base': `کدملی صحیح نمی‌باشد`,
      }),
    idNumber: Joi.string().min(1).max(10).messages({
      'string.base': `نوع ورودی شماره شناسنامه صحیح نمی‌باشد`,
      'string.max': `تعداد کارکترهای شماره شناسنامه بیش از حد مجاز است`,
    }),
    sex: Joi.boolean().messages({
      'boolean.base': `نوع ورودی جنسیت صحیح نمی‌باشد`,
    }).allow(null, "null"),
    birthDate: Joi.date().messages({
      'date.base': `ورودی باید تایم استمپ باشد `,
    }).allow(null, "null"),
    birthPlace: Joi.string().max(500).messages({
      'string.base': `نوع ورودی محل تولد صحیح نمی‌باشد`,
      'string.max': `تعداد کارکترهای محل تولد بیش از حد مجاز است`,
    }),
    personType: Joi.number().integer().messages({
      'number.base': `نوع ورودی نوع شخص صحیح نمی‌باشد`,
    }).allow(null, "null"),
    personPhoto: Joi.binary().messages({
      'binary.base': `نوع ورودی عکس صحیح نمی‌باشد`,
    }).allow(null, "null"),
    secretCode: Joi.string().max(30).messages({
      'number.base': `نوع ورودی نوع شخص صحیح نمی‌باشد`,
      'number.max': `تعداد کارکترهای نوع شخص بیش از حد مجاز است`,
    }).allow(null, "null"),
  })
  return schema.validate(body);
};


const validateLoadPersonalSearch = async (query) => {

  const schema = Joi.object().keys({
    page: Joi.number().integer().required().messages({
      'number.base': `ورودی صفحه صحیح نمی‌باشد`,
      'any.required': `ورودی صفحه اجباری است`
    }),
    name: Joi.string().min(1).max(500).messages({
      'string.base': `نوع نام شخص صحیح نمی‌باشد`,
      'string.max': `تعداد کارکترهای نام بیش از حد مجاز است`,
    }),
    family: Joi.string().min(1).max(500).messages({
      'string.base': `نوع نام خانوادگی شخص صحیح نمی‌باشد`,
      'string.max': `تعداد کارکترهای نام خانوادگی بیش از حد مجاز است`,
    }),
    nationalCode: Joi.string().messages({
      'string.base': `نوع کدملی صحیح نمی‌باشد`,
    }),
    sex: Joi.boolean().messages({
      'boolean.base': `نوع جنسیت صحیح نمی‌باشد`,
    }),
    personType: Joi.number().integer().min(1).max(3).messages({
      'number.base': `نوع ماهیت صحیح نمی‌باشد`,
      'number.max': `تعداد کارکترهای ماهیت بیش از حد مجاز است`,
    }),
  });
  return schema.validate(query);
};

const validateCreatePersonal = async (body) => {

  const schema = Joi.object().keys({
    name: Joi.string().required().min(1).max(500).messages({
      'string.base': `نوع ورودی نام صحیح نمی‌باشد`,
      'string.empty': `ورودی نام اجباری است`,
      'string.max': `تعداد کارکترهای نام بیش از حد مجاز است`,
      'any.required': `ورودی نام اجباری است`
    }),
    family: Joi.string().required().min(1).max(500).messages({
      'string.base': `نوع ورودی نام‌خانوادگی صحیح نمی‌باشد`,
      'string.empty': `نام‌خانوادگی اجباری است`,
      'string.max': `تعداد کارکترهای نام‌خانوادگی بیش از حد مجاز است`,
      'any.required': `نام‌خانوادگی اجباری است`
    }),
    nationalCode: Joi.string()
      .custom((value, helper) => {
        if (value) {
          if (value.length < 8 || parseInt(value, 10) == 0) return helper.message("کد ملی نادرست است")
          value = ('0000' + value).substr(value.length + 4 - 10);
          if (parseInt(value.substr(3, 6), 10) == 0) return helper.message("کد ملی نادرست است")
          if (value.length == 10) {
            if (value == '1111111111' || value == '0000000000' || value == '2222222222' ||
              value == '3333333333' || value == '4444444444' || value == '5555555555' ||
              value == '6666666666' || value == '7777777777' || value == '8888888888' ||
              value == '9999999999') {
              return helper.message("کد ملی نادرست است");
            }
            let c = parseInt(value.charAt(9));
            let n = 0;
            for (let i = 0; i < 9; i++) {
              n += parseInt(value.charAt(i)) * (10 - i)
            }
            r = n - parseInt(n / 11) * 11;
            if ((r == 0 && r == c) || (r == 1 && c == 1) || (r > 1 && c == 11 - r)) {
              return true;
            } else {
              return helper.message("کد ملی نادرست است");
            }
          } else return true;
        } else return true;
      }).messages({
        'string.base': `کدملی صحیح نمی‌باشد`,
      }),
    idNumber: Joi.string().min(1).max(10).messages({
      'string.base': `نوع ورودی شماره شناسنامه صحیح نمی‌باشد`,
      'string.max': `تعداد کارکترهای شماره شناسنامه بیش از حد مجاز است`,
    }),
    sex: Joi.boolean().required().messages({
      'boolean.base': `نوع ورودی جنسیت صحیح نمی‌باشد`,
      'boolean.empty': `تعیین جنسیت اجباری است`,
      'any.required': `تعیین جنسیت اجباری است`
    }),
    birthDate: Joi.date().messages({
      'date.base': `ورودی باید تایم استمپ باشد `,
    }).allow(null),


    birthPlace: Joi.string().max(500).messages({
      'string.base': `نوع ورودی محل تولد صحیح نمی‌باشد`,
      'string.max': `تعداد کارکترهای محل تولد بیش از حد مجاز است`,
    }).allow("", null),
    personType: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی نوع شخص صحیح نمی‌باشد`,
      'number.empty': `مقداردهی نوع شخص اجباری است`,
      'number.max': `تعداد کارکترهای نوع شخص بیش از حد مجاز است`,
      'any.required': `مقداردهی نوع شخص اجباری است`
    }),
    personPhoto: Joi.binary().messages({
      'binary.base': `نوع ورودی عکس صحیح نمی‌باشد`,
      'binary.empty': `عکس اجباری است`,
      'any.required': `عکس اجباری است`
    }).allow(null),
    secretCode: Joi.string().allow('', null),
  });

  return schema.validate(body);
};

const validateCreateNeedy = async (body) => {

  const schema = Joi.object().keys({
    name: Joi.string().required().min(1).max(500).messages({
      'string.base': `نوع ورودی نام صحیح نمی‌باشد`,
      'string.empty': `ورودی نام اجباری است`,
      'string.max': `تعداد کارکترهای نام بیش از حد مجاز است`,
      'any.required': `ورودی نام اجباری است`
    }),
    family: Joi.string().required().min(1).max(500).messages({
      'string.base': `نوع ورودی نام‌خانوادگی صحیح نمی‌باشد`,
      'string.empty': `نام‌خانوادگی اجباری است`,
      'string.max': `تعداد کارکترهای نام‌خانوادگی بیش از حد مجاز است`,
      'any.required': `نام‌خانوادگی اجباری است`
    }),
    // mobileNumber: Joi.string()
    //     .regex(/^[0-9]{12}$/)
    //     .custom((value, helper) => {
    //         if (parseInt(value) > 989000000000 && parseInt(value) < 989999999999) return true;
    //         return helper.message("شماره موبایل نادرست است");
    //     }),
    nationalCode: Joi.string()
      .custom((value, helper) => {
        if (value) {
          if (value.length < 8 || parseInt(value, 10) == 0) return helper.message("کد ملی نادرست است")
          value = ('0000' + value).substr(value.length + 4 - 10);
          if (parseInt(value.substr(3, 6), 10) == 0) return helper.message("کد ملی نادرست است")
          if (value.length == 10) {
            if (value == '1111111111' || value == '0000000000' || value == '2222222222' ||
              value == '3333333333' || value == '4444444444' || value == '5555555555' ||
              value == '6666666666' || value == '7777777777' || value == '8888888888' ||
              value == '9999999999') {
              return helper.message("کد ملی نادرست است");
            }
            let c = parseInt(value.charAt(9));
            let n = 0;
            for (let i = 0; i < 9; i++) {
              n += parseInt(value.charAt(i)) * (10 - i)
            }
            r = n - parseInt(n / 11) * 11;
            if ((r == 0 && r == c) || (r == 1 && c == 1) || (r > 1 && c == 11 - r)) {
              return true;
            } else {
              return helper.message("کد ملی نادرست است");
            }
          } else return true;
        } else return true;
      }).messages({
        'string.base': `کدملی صحیح نمی‌باشد`,
        'string.empty': `کدملی اجباری است`,
        'any.required': `کدملی اجباری است`
      }),
    idNumber: Joi.string().required().min(1).max(10).messages({
      'string.base': `نوع ورودی صحیح نمی‌باشد`,
      'string.empty': ` شماره شناسنامه اجباری است `,
      'any.required': `شماره شناسنامه اجباری است`,
      'string.max': `تعداد کارکترها بیش از حد مجاز است`,

    }),
    sex: Joi.boolean().required().messages({
      'boolean.base': `نوع ورودی جنسیت صحیح نمی‌باشد`,
      'boolean.empty': `تعیین جنسیت اجباری است`,
      'any.required': `تعیین جنسیت اجباری است`
    }),
    birthDate: Joi.date().required().messages({
      'date.base': `ورودی باید تایم استمپ باشد `,
      'any.required': `تعیین تاریخ تولد اجباری است`
    }),


    birthPlace: Joi.string().required().min(1).max(500).messages({
      'string.base': `نوع ورودی محل تولد صحیح نمی‌باشد`,
      'string.empty': `تعیین محل تولد اجباری است`,
      'string.max': `تعداد کارکترهای محل تولد بیش از حد مجاز است`,
      'any.required': `تعیین محل تولد اجباری است`
    }),
    personType: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی نوع شخص صحیح نمی‌باشد`,
      'number.empty': `تعیین نوع شخص اجباری است`,
      'number.max': `تعداد کارکترهای نوع شخص بیش از حد مجاز است`,
      'any.required': `تعیین نوع شخص اجباری است`
    }),
    // personPhoto: Joi.binary().custom((value, helper) => {
    //   if (value == "") {
    //     return helper.message("آپلود عکس اجباری است");
    //   }
    // }).messages({
    //   'binary.base': `نوع ورودی عکس صحیح نمی‌باشد`,
    //   'binary.empty': `آپلود عکس اجباری است`,
    //   'any.required': `آپلود عکس اجباری است`
    // }),
    secretCode: Joi.string().allow('', null),


  });

  return schema.validate(body);
};

const validateUpdatePersonal = async (body) => {

  const schema = Joi.object().keys({
    personId: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی شناسه شخص صحیح نمی‌باشد`,
      'number.empty': `شناسه شخص اجباری است`,
      'any.required': `شناسه شخص اجباری است`
    }),
    name: Joi.string().required().min(1).max(500).messages({
      'string.base': `نوع ورودی نام صحیح نمی‌باشد`,
      'string.empty': `ورودی نام اجباری است`,
      'string.max': `تعداد کارکترهای نام بیش از حد مجاز است`,
      'any.required': `ورودی نام اجباری است`
    }),
    family: Joi.string().required().min(1).max(500).messages({
      'string.base': `نوع ورودی نام‌خانوادگی صحیح نمی‌باشد`,
      'string.empty': `نام‌خانوادگی اجباری است`,
      'string.max': `تعداد کارکترهای نام‌خانوادگی بیش از حد مجاز است`,
      'any.required': `نام‌خانوادگی اجباری است`
    }),
    // mobileNumber: Joi.string()
    //     .regex(/^[0-9]{12}$/)
    //     .custom((value, helper) => {
    //         if (parseInt(value) > 989000000000 && parseInt(value) < 989999999999) return true;
    //         return helper.message("شماره موبایل نادرست است");
    //     }),
    nationalCode: Joi.string()
      .custom((value, helper) => {
        if (value) {
          if (value.length < 8 || parseInt(value, 10) == 0) return helper.message("کد ملی نادرست است")
          value = ('0000' + value).substr(value.length + 4 - 10);
          if (parseInt(value.substr(3, 6), 10) == 0) return helper.message("کد ملی نادرست است")
          if (value.length == 10) {
            if (value == '1111111111' || value == '0000000000' || value == '2222222222' ||
              value == '3333333333' || value == '4444444444' || value == '5555555555' ||
              value == '6666666666' || value == '7777777777' || value == '8888888888' ||
              value == '9999999999') {
              return helper.message("کد ملی نادرست است");
            }
            let c = parseInt(value.charAt(9));
            let n = 0;
            for (let i = 0; i < 9; i++) {
              n += parseInt(value.charAt(i)) * (10 - i)
            }
            r = n - parseInt(n / 11) * 11;
            if ((r == 0 && r == c) || (r == 1 && c == 1) || (r > 1 && c == 11 - r)) {
              return true;
            } else {
              return helper.message("کد ملی نادرست است");
            }
          } else return true;
        } else return true;
      }).messages({
        'string.base': `کدملی صحیح نمی‌باشد`,
        'string.empty': `کدملی اجباری است`,
        'any.required': `کدملی اجباری است`
      }),
    idNumber: Joi.string().min(1).max(10).messages({
      'string.base': `نوع ورودی شماره شناسنامه صحیح نمی‌باشد`,
      'string.max': `تعداد کارکترهای شماره شناسنامه بیش از حد مجاز است`,
    }),
    sex: Joi.boolean().required().messages({
      'boolean.base': `نوع ورودی جنسیت صحیح نمی‌باشد`,
      'boolean.empty': `تعیین جنسیت اجباری است`,
      'any.required': `تعیین جنسیت اجباری است`
    }),
    birthDate: Joi.date().messages({
      'date.base': `ورودی باید تایم استمپ باشد `,
    }).allow(null),


    birthPlace: Joi.string().max(500).messages({
      'string.base': `نوع ورودی محل تولد صحیح نمی‌باشد`,
      'string.max': `تعداد کارکترهای محل تولد بیش از حد مجاز است`,
    }),
    personType: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی نوع شخص صحیح نمی‌باشد`,
      'number.empty': `مقداردهی نوع شخص اجباری است`,
      'number.max': `تعداد کارکترهای نوع شخص بیش از حد مجاز است`,
      'any.required': `مقداردهی نوع شخص اجباری است`
    }),
    // personPhoto: Joi.binary().messages({
    //   'binary.base': `نوع ورودی عکس صحیح نمی‌باشد`,
    //   'binary.empty': `عکس اجباری است`,
    //   'any.required': `عکس اجباری است`
    // }).allow(null),
    secretCode: Joi.string().allow('', null),

  });

  return schema.validate(body);
};

const validateUpdateNeedy = async (body) => {

  const schema = Joi.object().keys({
    personId: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی شناسه شخص صحیح نمی‌باشد`,
      'number.empty': `شناسه شخص اجباری است`,
      'any.required': `شناسه شخص اجباری است`
    }),
    name: Joi.string().required().min(1).max(500).messages({
      'string.base': `نوع ورودی نام صحیح نمی‌باشد`,
      'string.empty': `ورودی نام اجباری است`,
      'string.max': `تعداد کارکترهای نام بیش از حد مجاز است`,
      'any.required': `ورودی نام اجباری است`
    }),
    family: Joi.string().required().min(1).max(500).messages({
      'string.base': `نوع ورودی نام‌خانوادگی صحیح نمی‌باشد`,
      'string.empty': `نام‌خانوادگی اجباری است`,
      'string.max': `تعداد کارکترهای نام‌خانوادگی بیش از حد مجاز است`,
      'any.required': `نام‌خانوادگی اجباری است`
    }),
    // mobileNumber: Joi.string()
    //     .regex(/^[0-9]{12}$/)
    //     .custom((value, helper) => {
    //         if (parseInt(value) > 989000000000 && parseInt(value) < 989999999999) return true;
    //         return helper.message("شماره موبایل نادرست است");
    //     }),
    nationalCode: Joi.string()
      .custom((value, helper) => {
        if (value) {
          if (value.length < 8 || parseInt(value, 10) == 0) return helper.message("کد ملی نادرست است")
          value = ('0000' + value).substr(value.length + 4 - 10);
          if (parseInt(value.substr(3, 6), 10) == 0) return helper.message("کد ملی نادرست است")
          if (value.length == 10) {
            if (value == '1111111111' || value == '0000000000' || value == '2222222222' ||
              value == '3333333333' || value == '4444444444' || value == '5555555555' ||
              value == '6666666666' || value == '7777777777' || value == '8888888888' ||
              value == '9999999999') {
              return helper.message("کد ملی نادرست است");
            }
            let c = parseInt(value.charAt(9));
            let n = 0;
            for (let i = 0; i < 9; i++) {
              n += parseInt(value.charAt(i)) * (10 - i)
            }
            r = n - parseInt(n / 11) * 11;
            if ((r == 0 && r == c) || (r == 1 && c == 1) || (r > 1 && c == 11 - r)) {
              return true;
            } else {
              return helper.message("کد ملی نادرست است");
            }
          } else return true;
        } else return true;
      }).messages({
        'string.base': `کدملی صحیح نمی‌باشد`,
        'string.empty': `کدملی اجباری است`,
        'any.required': `کدملی اجباری است`
      }),
    idNumber: Joi.string().required().min(1).max(10).messages({
      'string.base': `نوع ورودی صحیح نمی‌باشد`,
      'string.empty': ` شماره شناسنامه اجباری است `,
      'any.required': `شماره شناسنامه اجباری است`,
      'string.max': `تعداد کارکترها بیش از حد مجاز است`,

    }),
    sex: Joi.boolean().required().messages({
      'boolean.base': `نوع ورودی جنسیت صحیح نمی‌باشد`,
      'boolean.empty': `تعیین جنسیت اجباری است`,
      'any.required': `تعیین جنسیت اجباری است`
    }),
    birthDate: Joi.date().required().messages({
      'date.base': `ورودی باید تایم استمپ باشد `,
      'any.required': `تعیین تاریخ تولد اجباری است`
    }),


    birthPlace: Joi.string().required().min(1).max(500).messages({
      'string.base': `نوع ورودی محل تولد صحیح نمی‌باشد`,
      'string.empty': `تعیین محل تولد اجباری است`,
      'string.max': `تعداد کارکترهای محل تولد بیش از حد مجاز است`,
      'any.required': `تعیین محل تولد اجباری است`
    }),
    personType: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی نوع شخص صحیح نمی‌باشد`,
      'number.empty': `تعیین نوع شخص اجباری است`,
      'number.max': `تعداد کارکترهای نوع شخص بیش از حد مجاز است`,
      'any.required': `تعیین نوع شخص اجباری است`
    }),
    // personPhoto: Joi.binary().required().custom((value, helper) => {
    //   if(value == ""){
    //     return helper.message("آپلود عکس اجباری است");
    //   }
    // }).messages({
    //   'binary.base': `نوع ورودی عکس صحیح نمی‌باشد`,
    //   'binary.empty': `آپلود عکس اجباری است`,
    //   'any.required': `آپلود عکس اجباری است`
    // }),
    secretCode: Joi.string().allow('', null),


  });

  return schema.validate(body);
};

const validateDeletePersonal = async (body) => {

  const schema = Joi.object().keys({
    personId: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی شناسه شخص صحیح نمی‌باشد`,
      'number.empty': `شناسه شخص اجباری است`,
      'any.required': `شناسه شخص اجباری است`
    }),
  });

  return schema.validate(body);
};


/////-------------- User Validator ----------------------------------------

const validateCreateUserPersonal = async (body) => {
  const schema = Joi.object().keys({
    name: Joi.string().required().min(1).max(500).messages({
      'string.base': `نوع ورودی نام صحیح نمی‌باشد`,
      'string.empty': `ورودی نام اجباری است`,
      'string.max': `تعداد کارکترهای نام بیش از حد مجاز است`,
      'any.required': `ورودی نام اجباری است`
    }),
    family: Joi.string().required().min(1).max(500).messages({
      'string.base': `نوع ورودی نام‌خانوادگی صحیح نمی‌باشد`,
      'string.empty': `نام‌خانوادگی اجباری است`,
      'string.max': `تعداد کارکترهای نام‌خانوادگی بیش از حد مجاز است`,
      'any.required': `نام‌خانوادگی اجباری است`
    }),
    nationalCode: Joi.string()
      .custom((value, helper) => {
        if (value) {
          if (value.length < 8 || parseInt(value, 10) == 0) return helper.message("کد ملی نادرست است")
          value = ('0000' + value).substr(value.length + 4 - 10);
          if (parseInt(value.substr(3, 6), 10) == 0) return helper.message("کد ملی نادرست است")
          if (value.length == 10) {
            if (value == '1111111111' || value == '0000000000' || value == '2222222222' ||
              value == '3333333333' || value == '4444444444' || value == '5555555555' ||
              value == '6666666666' || value == '7777777777' || value == '8888888888' ||
              value == '9999999999') {
              return helper.message("کد ملی نادرست است");
            }
            let c = parseInt(value.charAt(9));
            let n = 0;
            for (let i = 0; i < 9; i++) {
              n += parseInt(value.charAt(i)) * (10 - i)
            }
            r = n - parseInt(n / 11) * 11;
            if ((r == 0 && r == c) || (r == 1 && c == 1) || (r > 1 && c == 11 - r)) {
              return true;
            } else {
              return helper.message("کد ملی نادرست است");
            }
          } else return true;
        } else return true;
      }).messages({
        'string.base': `کدملی صحیح نمی‌باشد`,
      }),

    sex: Joi.boolean().required().messages({
      'boolean.base': `نوع ورودی جنسیت صحیح نمی‌باشد`,
      'boolean.empty': `تعیین جنسیت اجباری است`,
      'any.required': `تعیین جنسیت اجباری است`
    }),
    personType: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی نوع شخص صحیح نمی‌باشد`,
      'number.empty': `مقداردهی نوع شخص اجباری است`,
      'number.max': `تعداد کارکترهای نوع شخص بیش از حد مجاز است`,
      'any.required': `مقداردهی نوع شخص اجباری است`
    }),
    username: Joi.string().required().min(4).max(15).messages({
      'string.base': `نوع ورودی صحیح نمی‌باشد`,
      'string.empty': `ورودی اجباری است`,
      'string.max': `تعداد کارکترها بیش از حد مجاز است`,
      'any.required': `ورودی اجباری است`
    }),
    password: Joi.string().required().min(6).max(15).messages({
      'string.base': `رمز عبور وارد شده صحیح نمی‌باشد`,
      'string.min': `رمز عبور باید بیشتر از 6 کاراکتر باشد`,
      'string.max': `تعداد کارکترها بیش از حد مجاز است`,
      'any.required': `ورودی اجباری است`
    }),
    expireDate: Joi.date().timestamp().messages({
      'date.base': `زمان انقضا وارد شده صحیح نمی‌باشد`,
      'date.date': `نوع ورودی باید تایم‌استمپ باشد`,
      'date.timestamp': `نوع ورودی باید تایم‌استمپ باشد`
    }),
    active: Joi.boolean().required().messages({
      'boolean.base': `نوع ورودی صحیح نمی‌باشد`,
      'any.required': `ورودی اجباری است`
    }),
  });
  return schema.validate(body);
};


const validateCreateUser = async (body) => {
  const schema = Joi.object().keys({
    personId: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`,
      'number.empty': `ورودی اجباری است`,
      'any.required': `ورودی اجباری است`
    }),
    username: Joi.string().required().min(4).max(15).messages({
      'string.base': `نوع ورودی صحیح نمی‌باشد`,
      'string.empty': `ورودی اجباری است`,
      'string.max': `تعداد کارکترها بیش از حد مجاز است`,
      'any.required': `ورودی اجباری است`
    }),
    password: Joi.string().required().min(6).max(15).messages({
      'string.base': `رمز عبور وارد شده صحیح نمی‌باشد`,
      'string.min': `رمز عبور باید بیشتر از 6 کاراکتر باشد`,
      'string.max': `تعداد کارکترها بیش از حد مجاز است`,
      'any.required': `ورودی اجباری است`
    }),
    expireDate: Joi.date()
    .messages({
      'date.base': `ورودی باید تایم استمپ باشد `,
    }).allow(null,""),
    active: Joi.boolean().required().messages({
      'boolean.base': `نوع ورودی صحیح نمی‌باشد`,
      'any.required': `ورودی اجباری است`
    }),
  });
  return schema.validate(body);
};


const validateUpdateUser = async (body, userId) => {
  body.userId = userId;
  const schema = Joi.object().keys({
    userId: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`,
      'number.empty': `ورودی اجباری است`,
      'any.required': `ورودی اجباری است`
    }),
    personId: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`,
      'number.empty': `ورودی اجباری است`,
      'any.required': `ورودی اجباری است`
    }),
    username: Joi.string().required().min(4).max(15).messages({
      'string.base': `نوع ورودی صحیح نمی‌باشد`,
      'string.empty': `ورودی اجباری است`,
      'string.max': `تعداد کارکترها بیش از حد مجاز است`,
      'any.required': `ورودی اجباری است`
    }),
    password: Joi.string().allow(null, '').optional().min(6).max(15).messages({
      'string.base': `رمز عبور وارد شده صحیح نمی‌باشد`,
      'string.min': `رمز عبور باید بیشتر از 6 کاراکتر باشد`,
      'string.max': `تعداد کارکترها بیش از حد مجاز است`,
      'any.required': `ورودی اجباری است`
    }),
    expireDate: Joi.date()
    .messages({
      'date.base': `ورودی باید تایم استمپ باشد `,
    }).allow(null,""),
    active: Joi.boolean().required().messages({
      'boolean.base': `نوع ورودی صحیح نمی‌باشد`,
      'any.required': `ورودی اجباری است`
    }),
  });
  return schema.validate(body);
};


const validateLoadUser = async (query) => {
  const schema = Joi.object().keys({
    userId: Joi.number().integer().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`
    }),
    personId: Joi.number().integer().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`
    }),
    username: Joi.string().messages({
      'string.base': `نوع ورودی صحیح نمی‌باشد`,
      'string.max': `تعداد کارکترها بیش از حد مجاز است`
    }),
    expireDate: Joi.string().messages({
      'string.base': `نوع ورودی صحیح نمی‌باشد`,
      'string.max': `تعداد کارکترها بیش از حد مجاز است`
    }),
    active: Joi.boolean().messages({
      'boolean.base': `نوع ورودی صحیح نمی‌باشد`,
    })
  });
  return schema.validate(query);
}

const validateLoadUserPaginate = async (query) => {
  const schema = Joi.object().keys({
    page: Joi.number().integer().required().messages({
      'number.base': `ورودی صفحه صحیح نمی‌باشد`,
      'any.required': `ورودی صفحه اجباری است`
    }),
    userId: Joi.number().integer().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`
    }),
    personId: Joi.number().integer().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`
    }),
    username: Joi.string().messages({
      'string.base': `نوع ورودی صحیح نمی‌باشد`,
      'string.max': `تعداد کارکترها بیش از حد مجاز است`
    }).allow("",null),
    expireDate: Joi.string().messages({
      'string.base': `نوع ورودی صحیح نمی‌باشد`,
      'string.max': `تعداد کارکترها بیش از حد مجاز است`
    }),
    active: Joi.boolean().messages({
      'boolean.base': `نوع ورودی صحیح نمی‌باشد`,
    })
  });
  return schema.validate(query);
}


const validateDeleteUser = async (params) => {
  const schema = Joi.object().keys({
    userId: Joi.number().integer().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`,
      'number.empty': `ورودی اجباری است`,
      'any.required': `ورودی اجباری است`
    })
  });
  return schema.validate(params);
}

const validateLogin = async (body) => {
  const schema = Joi.object().keys({
    username: Joi.string().required().min(1).messages({
      'string.base': `نوع نام کاربری صحیح نمی‌باشد`,
      'string.max': `تعداد کارکترهای نام کاربری کمتر از حد مجاز است`,
      'string.required': 'نام کاربری اجباری است'
    }),
    password: Joi.string().messages({
      'string.base': `نوع رمزعبور صحیح نمی‌باشد`,
    }),
    refreshToken: Joi.string().messages({
      'string.base': `نوع رفرش توکن صحیح نمی‌باشد`,
    })
  });
  return schema.validate(body);
}

/////-------------- Role Validator ----------------------------------------

const validateCreateRole = async (body) => {
  const schema = Joi.object().keys({
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
  return schema.validate(body);
};


const validateUpdateRole = async (body, roleId) => {
  body.roleId = roleId;
  const schema = Joi.object().keys({
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
  return schema.validate(body);
};


const validateLoadRole = async (query) => {
  const schema = Joi.object().keys({
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
  return schema.validate(query);
}

const validateDeleteRole = async (params) => {
  const schema = Joi.object().keys({
    roleId: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`,
      'number.empty': `شناسه نقش اجباری است`,
      'any.required': `شناسه نقش اجباری است`
    })
  });
  return schema.validate(params);
}

//------------------ validate SystemForm  NO CHECED ------------------------------------------------

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


/////-------------- AssignRoleToUSer Validator ----------------------------------------

const validateAssignRoleToUser = async (body) => {
  const schema = Joi.object().keys({
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
  return schema.validate(body);
};

const validateLoadAssignRoleToUser = async (body) => {
  const schema = Joi.object().keys({
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
  return schema.validate(body);
};


const validateDeleteRolesFromUser = async (params) => {
  const schema = Joi.object().keys({
    userId: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی صحیح نمی‌باشد`,
      'number.empty': `ورودی اجباری است`,
      'any.required': `ورودی اجباری است`
    })
  });
  return schema.validate(params);
}
//-------------------------------------------------------------------------------------
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
//------------------------------------------------------------------

module.exports = {
  validateCreatePersonal, validateUpdatePersonal, validateDeletePersonal, validateLoadPersonal, validateCreateNeedy, validateLoadPersonalSearch,
  validateUpdateNeedy,
  validateCreateUser, validateUpdateUser, validateLoadUser, validateDeleteUser, validateLoadUserPaginate, validateLogin, validateCreateUserPersonal,
  validateCreateRole, validateUpdateRole, validateLoadRole, validateDeleteRole,
  validateAssignRoleToUser, validateLoadAssignRoleToUser, validateDeleteRolesFromUser,
  validateCreateSystemForm, validateUpdateSystemForm, validateLoadSystemForm, validateDeleteSystemForm,
  validateAssignPermissionToRole, validateLoadPermission, validateDeletePermission
};