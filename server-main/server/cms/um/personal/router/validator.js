const Joi = require('joi');
const  english_digit  = require('../../../../utility/fnChangeFarsiNumber');
const  preventSqlInjection  = require('../../../../utility/fnPreventSqlInjection').custom;
const  preventSqlInjectionV2  = require('../../../../utility/fnPreventSqlInjection').customInjection;



const validateLoadPersonal = async (query) => {

  const schema = Joi.object().keys({
    page: Joi.number().integer().messages({
      'number.base': `ورودی صفحه صحیح نمی‌باشد`,
    }).allow('null', null),
    personId: Joi.number().integer().messages({
      'number.base': `نوع ورودی شناسه شخص صحیح نمی‌باشد`,
    }).allow('null', null),
    name: Joi.string().min(1).max(500)
      .custom((value, helper)=>{
        if(preventSqlInjection(value)){
            return true
        }else {return helper.message("از کاراکترهای غیر مجاز در نام شعبه استفاده نکنید");}
        }).messages({
            'string.base': `نوع ورودی نام صحیح نمی‌باشد`,
            'string.max': `تعداد کارکترهای نام بیش از حد مجاز است`,
        }).allow(null,"null"),
    family: Joi.string().min(1).max(500)
        .custom((value, helper)=>{
        if(preventSqlInjection(value)){
              return true
          }else {return helper.message("از کاراکترهای غیر مجاز در نام شعبه استفاده نکنید");}
        }).messages({
          'string.base': `نوع ورودی نام‌خانوادگی صحیح نمی‌باشد`,
          'string.max': `تعداد کارکترهای نام‌خانوادگی بیش از حد مجاز است`,
        }).allow(null,"null"),
    nationalCode: Joi.string()
      .custom((value, helper) => {
        if (value) {
          value = english_digit(value)
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
      }).allow(null,"null"),
    idNumber: Joi.string().min(1).max(10)
      .custom((value, helper)=>{
        if(preventSqlInjection(value)){
            return true
        }else {return helper.message("از کاراکترهای غیر مجاز در نام شعبه استفاده نکنید");}
        }).messages({
        'string.base': `نوع ورودی شماره شناسنامه صحیح نمی‌باشد`,
        'string.max': `تعداد کارکترهای شماره شناسنامه بیش از حد مجاز است`,
      }).allow(null,"null"),
    sex: Joi.boolean().messages({
      'boolean.base': `نوع ورودی جنسیت صحیح نمی‌باشد`,
    }).allow(null, "null"),
    birthDate: Joi.date().messages({
      'date.base': `ورودی باید تایم استمپ باشد `,
    }).allow(null, "null"),
    birthPlace: Joi.string().max(500)
      .custom((value, helper)=>{
        if(preventSqlInjection(value)){
            return true
        }else {return helper.message("از کاراکترهای غیر مجاز در نام شعبه استفاده نکنید");}
      }).messages({
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
  return schema.validate(query);
};

const validateLoadPersonalSearch = async (query) => {

  const schema = Joi.object().keys({
    page: Joi.number().integer().required().messages({
      'number.base': `ورودی صفحه صحیح نمی‌باشد`,
      'any.required': `ورودی صفحه اجباری است`
    }),
    name: Joi.string().min(1).max(500)
    .custom((value, helper)=>{
      if(preventSqlInjection(value)){
           return true
      }else {return helper.message("از کاراکترهای غیر مجاز در نام شعبه استفاده نکنید");}
    }).messages({
      'string.base': `نوع نام شخص صحیح نمی‌باشد`,
      'string.max': `تعداد کارکترهای نام بیش از حد مجاز است`,
    }).allow(null,"null"),
    family: Joi.string().min(1).max(500)
    .custom((value, helper)=>{
      if(preventSqlInjection(value)){
           return true
      }else {return helper.message("از کاراکترهای غیر مجاز در نام شعبه استفاده نکنید");}
     }).messages({
      'string.base': `نوع نام خانوادگی شخص صحیح نمی‌باشد`,
      'string.max': `تعداد کارکترهای نام خانوادگی بیش از حد مجاز است`,
    }).allow(null,"null"),
    nationalCode: Joi.string()
      .custom((value, helper)=>{
        if(preventSqlInjection(value)){
            return true
        }else {return helper.message("از کاراکترهای غیر مجاز در نام شعبه استفاده نکنید");}
      }).messages({
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
    name: Joi.string().required().min(1).max(500).trim()
    .custom((value, helper)=>{
      if(preventSqlInjection(value)){
          return true
      }else {return helper.message("از کاراکترهای غیر مجاز در نام استفاده نکنید");}
    }).messages({
      'string.base': `نوع ورودی نام صحیح نمی‌باشد`,
      'string.empty': `ورودی نام اجباری است`,
      'string.max': `تعداد کارکترهای نام بیش از حد مجاز است`,
      'any.required': `ورودی نام اجباری است`
    }),
    family: Joi.string().required().min(1).max(500).trim()
    .custom((value, helper)=>{
      if(preventSqlInjection(value)){
          return true
      }else {return helper.message("از کاراکترهای غیر مجاز در نام خانوادگی استفاده نکنید");}
    }).messages({
      'string.base': `نوع ورودی نام‌خانوادگی صحیح نمی‌باشد`,
      'string.empty': `نام‌خانوادگی اجباری است`,
      'string.max': `تعداد کارکترهای نام‌خانوادگی بیش از حد مجاز است`,
      'any.required': `نام‌خانوادگی اجباری است`
    }),
    nationalCode: Joi.string()
      .custom((value, helper) => {
          value = english_digit(value)
          if(value == "") return helper.message("کد ملی را پر کنید")
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
       
      }).messages({
        'string.base': `کدملی صحیح نمی‌باشد`,
        'string.empty': `کد ملی را پر کنید`,
      }),
    idNumber: Joi.string().min(1).max(10)
    .custom((value, helper)=>{
      if(preventSqlInjection(value)){
          return true
      }else {return helper.message("از کاراکترهای غیر مجاز در شماره شناسنامه استفاده نکنید");}
    }).messages({
      'string.base': `نوع ورودی شماره شناسنامه صحیح نمی‌باشد`,
      'string.max': `تعداد کارکترهای شماره شناسنامه بیش از حد مجاز است`,
    }).allow(null,""),
    sex: Joi.boolean().required().messages({
      'boolean.base': `نوع ورودی جنسیت صحیح نمی‌باشد`,
      'boolean.empty': `تعیین جنسیت اجباری است`,
      'any.required': `تعیین جنسیت اجباری است`
    }),
    birthDate: Joi.date()
    .custom((value, helper)=>{
      if(preventSqlInjectionV2(value)){
          return true
      }else {return helper.message("از کاراکترهای غیر مجاز در تاریخ استفاده نکنید");}
    }).messages({
      'date.base': `ورودی باید تایم استمپ باشد `,
    }).allow(null,""),
    birthPlace: Joi.string().max(500)
    .custom((value, helper)=>{
      if(preventSqlInjection(value)){
          return true
      }else {return helper.message("از کارکترهای غیر مجاز در محل تولد استفاده نکنید");}
    }).messages({
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
    }).allow(null,""),
    secretCode: Joi.string().allow('', null),
  });
  return schema.validate(body);
};

const validateCreateNeedy = async (body) => {

  const schema = Joi.object().keys({
    name: Joi.string().required().min(1).max(500).trim()
    .custom((value, helper)=>{
      if(preventSqlInjection(value)){
          return true
      }else {return helper.message("از کارکترهای غیر مجاز در نام استفاده نکنید");}
    }).messages({
      'string.base': `نوع ورودی نام صحیح نمی‌باشد`,
      'string.empty': `ورودی نام اجباری است`,
      'string.max': `تعداد کارکترهای نام بیش از حد مجاز است`,
      'any.required': `ورودی نام اجباری است`
    }),
    family: Joi.string().required().min(1).max(500).trim()
    .custom((value, helper)=>{
      if(preventSqlInjection(value)){
          return true
      }else {return helper.message("از کارکترهای غیر مجاز در نام خانوادگی استفاده نکنید");}
    }).messages({
      'string.base': `نوع ورودی نام‌خانوادگی صحیح نمی‌باشد`,
      'string.empty': `نام‌خانوادگی اجباری است`,
      'string.max': `تعداد کارکترهای نام‌خانوادگی بیش از حد مجاز است`,
      'any.required': `نام‌خانوادگی اجباری است`
    }),
    nationalCode: Joi.string()
      .custom((value, helper) => {
          value = english_digit(value)
          if(value == "") return helper.message("کد ملی را پر کنید")
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
       
      }).messages({
        'string.base': `کدملی صحیح نمی‌باشد`,
        'string.empty': `کدملی اجباری است`,
        'any.required': `کدملی اجباری است`
      }),
    idNumber: Joi.string().required().min(1).max(10).trim()
    .custom((value, helper)=>{
      if(preventSqlInjection(value)){
          return true
      }else {return helper.message("از کاراکترهای غیر مجاز در شماره شناسنامه استفاده نکنید");}
    }).messages({
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
    birthDate: Joi.date().required()
    .custom((value, helper)=>{
      if(preventSqlInjectionV2(value)){
          return true
      }else {return helper.message("از کاراکترهای غیر مجاز در تاریخ استفاده نکنید");}
    }).messages({
      'date.base': `ورودی باید تایم استمپ باشد `,
      'any.required': `تعیین تاریخ تولد اجباری است`
    }),
    birthPlace: Joi.string().required().min(1).max(500).trim()
    .custom((value, helper)=>{
      if(preventSqlInjection(value)){
          return true
      }else {return helper.message("از کاراکترهای غیر مجاز در نام شعبه استفاده نکنید");}
    }).messages({
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
    personPhoto: Joi.binary().custom((value, helper) => {
      if (value == "") {
        return helper.message("آپلود عکس اجباری است");
      }
    }).messages({
      'binary.base': `نوع ورودی عکس صحیح نمی‌باشد`,
      'binary.empty': `آپلود عکس اجباری است`,
      'any.required': `آپلود عکس اجباری است`
    }),
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
    name: Joi.string().required().min(1).max(500).trim()
    .custom((value, helper)=>{
      if(preventSqlInjection(value)){
          return true
      }else {return helper.message("از کاراکترهای غیر مجاز در نام استفاده نکنید");}
    }).messages({
      'string.base': `نوع ورودی نام صحیح نمی‌باشد`,
      'string.empty': `ورودی نام اجباری است`,
      'string.max': `تعداد کارکترهای نام بیش از حد مجاز است`,
      'any.required': `ورودی نام اجباری است`
    }),
    family: Joi.string().required().min(1).max(500).trim()
    .custom((value, helper)=>{
      if(preventSqlInjection(value)){
          return true
      }else {return helper.message("از کاراکترهای غیر مجاز در نام خانوادگی استفاده نکنید");}
    }).messages({
      'string.base': `نوع ورودی نام‌خانوادگی صحیح نمی‌باشد`,
      'string.empty': `نام‌خانوادگی اجباری است`,
      'string.max': `تعداد کارکترهای نام‌خانوادگی بیش از حد مجاز است`,
      'any.required': `نام‌خانوادگی اجباری است`
    }),
    nationalCode: Joi.string()
      .custom((value, helper) => {
          value = english_digit(value)
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
      }).messages({
        'string.base': `کدملی صحیح نمی‌باشد`,
        'string.empty': `کدملی اجباری است`,
        'any.required': `کدملی اجباری است`
      }),
    idNumber: Joi.string().min(1).max(10)
    .custom((value, helper)=>{
      if(preventSqlInjection(value)){
          return true
      }else {return helper.message("از کاراکترهای غیر مجاز در شماره شناسنامه استفاده نکنید");}
    }).messages({
      'string.base': `نوع ورودی شماره شناسنامه صحیح نمی‌باشد`,
      'string.max': `تعداد کارکترهای شماره شناسنامه بیش از حد مجاز است`,
    }).allow("",null),
    sex: Joi.boolean().required().messages({
      'boolean.base': `نوع ورودی جنسیت صحیح نمی‌باشد`,
      'boolean.empty': `تعیین جنسیت اجباری است`,
      'any.required': `تعیین جنسیت اجباری است`
    }),
    birthDate: Joi.date()
    .custom((value, helper)=>{
      if(preventSqlInjectionV2(value)){
          return true
      }else {return helper.message("از کاراکترهای غیر مجاز در تاریخ استفاده نکنید");}
    }).messages({
      'date.base': `ورودی باید تایم استمپ باشد `,
    }).allow(null),
    personPhoto: Joi.binary().messages({
      'binary.base': `نوع ورودی عکس صحیح نمی‌باشد`,
    }).allow(null,""),
    birthPlace: Joi.string().max(500)
    .custom((value, helper)=>{
      if(preventSqlInjection(value)){
          return true
      }else {return helper.message("از کاراکترهای غیر مجاز در مکان تولد استفاده نکنید");}
    }).messages({
      'string.base': `نوع ورودی محل تولد صحیح نمی‌باشد`,
      'string.max': `تعداد کارکترهای محل تولد بیش از حد مجاز است`,
    }).allow(null,""),
    personType: Joi.number().integer().required().messages({
      'number.base': `نوع ورودی نوع شخص صحیح نمی‌باشد`,
      'number.empty': `مقداردهی نوع شخص اجباری است`,
      'number.max': `تعداد کارکترهای نوع شخص بیش از حد مجاز است`,
      'any.required': `مقداردهی نوع شخص اجباری است`
    }),
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
    name: Joi.string().required().min(1).max(500).trim()
    .custom((value, helper)=>{
      if(preventSqlInjection(value)){
          return true
      }else {return helper.message("از کاراکترهای غیر مجاز در نام استفاده نکنید");}
    }).messages({
      'string.base': `نوع ورودی نام صحیح نمی‌باشد`,
      'string.empty': `ورودی نام اجباری است`,
      'string.max': `تعداد کارکترهای نام بیش از حد مجاز است`,
      'any.required': `ورودی نام اجباری است`
    }),
    family: Joi.string().required().min(1).max(500).trim()
    .custom((value, helper)=>{
      if(preventSqlInjection(value)){
          return true
      }else {return helper.message("از کاراکترهای غیر مجاز در نام خانوادگی استفاده نکنید");}
    }).messages({
      'string.base': `نوع ورودی نام‌خانوادگی صحیح نمی‌باشد`,
      'string.empty': `نام‌خانوادگی اجباری است`,
      'string.max': `تعداد کارکترهای نام‌خانوادگی بیش از حد مجاز است`,
      'any.required': `نام‌خانوادگی اجباری است`
    }),
    nationalCode: Joi.string()
      .custom((value, helper) => {
        if (value) {
          value = english_digit(value)
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
    idNumber: Joi.string().required().min(1).max(10).trim()
    .custom((value, helper)=>{
      if(preventSqlInjection(value)){
          return true
      }else {return helper.message("از کارکترهای غیر مجاز در شماره شناسنامه استفاده نکنید");}
    }).messages({
      'string.base': `نوع ورودی صحیح نمی‌باشد`,
      'string.empty': ` شماره شناسنامه اجباری است `,
      'any.required': `شماره شناسنامه اجباری است`,
      'string.max': `تعداد کارکترها بیش از حد مجازاست`,
    }),
    sex: Joi.boolean().required().messages({
      'boolean.base': `نوع ورودی جنسیت صحیح نمی‌باشد`,
      'boolean.empty': `تعیین جنسیت اجباری است`,
      'any.required': `تعیین جنسیت اجباری است`
    }),
    birthDate: Joi.date().required()
    .custom((value, helper)=>{
      if(preventSqlInjectionV2(value)){
          return true
      }else {return helper.message("از کاراکترهای غیر مجاز در تاریخ استفاده نکنید");}
    }).messages({
      'date.base': `ورودی باید تایم استمپ باشد `,
      'any.required': `تعیین تاریخ تولد اجباری است`
    }),
    birthPlace: Joi.string().required().min(1).max(500).trim()
    .custom((value, helper)=>{
      if(preventSqlInjection(value)){
          return true
      }else {return helper.message("از کاراکترهای غیر مجاز در مکان تولد استفاده نکنید");}
    }).messages({
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
    personPhoto: Joi.binary().custom((value, helper) => {
      if(value == ""){
        return helper.message("آپلود عکس اجباری است");
      }
    }).messages({
      'binary.base': `نوع ورودی عکس صحیح نمی‌باشد`,
      'binary.empty': `آپلود عکس اجباری است`,
      'any.required': `آپلود عکس اجباری است`
    }),
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


module.exports = {
  validateCreatePersonal, validateUpdatePersonal, validateDeletePersonal, validateLoadPersonal, validateCreateNeedy, validateLoadPersonalSearch,
  validateUpdateNeedy
};