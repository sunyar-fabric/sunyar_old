const GlobalExceptionsEn = {
  ServiceError: {
    code: 1,
    message: "Ooops, internal sever error!",
    httpStatusCode: 500,
  },
  dependecyError: {
    code: 61,
    message: "Due to dependency item can't be deleted",
    httpStatusCode: 500,
  },
  //-- dbExceptions---
  db: {
    InputsNotUnique: {
      code: 3,
      message: "Input values are not unique",
      httpStatusCode: 409,
    },
    InputNotValide: {
      code: 4,
      message: "Input values are not valid",
      httpStatusCode: 409,
    },
    PrimaryKeyNotFound: {
      code: 5,
      message: "Primary key not found",
      httpStatusCode: 404,
    },
    DataBaseError: {
      code: 6,
      message: "Database error occured",
      httpStatusCode: 409,
    },
  },
  //-- authExceptions---
  auth: {
    TokenExpired: {
      code: 7,
      message: "please sign in again",
      httpStatusCode: 401,
      httpStatusMessage: "Unauthorized",
    },
    WrongAccessToken: {
      code: 8,
      message: "Access token is not valid",
      httpStatusCode: 401,
      httpStatusMessage: "Unauthorized",
    },
    AccessTokenError: {
      code: 9,
      message: "An unauthorized request",
      httpStatusCode: 401,
      httpStatusMessage: "Unauthorized",
    },
    waiting: {
      code: 10,
      message: "Too many requests, try to login later",
      httpStatusCode: 404,
      httpStatusMessage: "Unauthorized",
    },
  },
  //-- accessPermissionExceptions---
  accessPermission: {
    FormNotFound: {
      code: 11,
      message: "Cant't find a form with these specifications",
      httpStatusCode: 404,
    },
    FormUseAsSysParent: {
      code: 12,
      message: "Due to dependency can't delete the system form as a parent",
      httpStatusCode: 404,
    },
    FormUseAsFK: {
      code: 13,
      message:
        "Due to access permision(s) dependency, can't delete the system form",
      httpStatusCode: 404,
    },
    PermissionNotFound: {
      code: 14,
      message: "Access permision not found",
      httpStatusCode: 404,
    },
  },
  //-- jwtExceptions---
  jwt: {
    NotAuthorized: {
      code: 15,
      message: "Aceess is denied",
      httpStatusCode: 401,
    },
    WrongCredential: {
      code: 16,
      message: "Wrong credential",
      httpStatusCode: 401,
    },
    invalidAuthorizationHeader: {
      code: 17,
      message: "Invalid Authorization Header",
      httpStatusCode: 400,
    },
    Forbidden: {
      code: 18,
      message: "Acess is forbidden",
      httpStatusCode: 403,
    },
    YouAID: {
      code: 19,
      message: "As an aid, you can't add any person except needy",
      httpStatusCode: 403,
    },
  },
  //-- roleExceptions---
  role: {
    RoleNotFound: {
      code: 20,
      message: "Can't find role with these specifications",
      httpStatusCode: 404,
    },
    RoleUseAsFK: {
      code: 21,
      message: "Role can't be deleted because it's already assigned to user(s)",
      httpStatusCode: 409,
    },
    AssignRoleToUserNotFound: {
      code: 22,
      message: "Cant't find the role specified as user's role assignment",
      httpStatusCode: 404,
    },
  },
  //-- userExceptions---
  user: {
    PersonNotFound: {
      code: 23,
      message: "Can't find person with these specifications",
      httpStatusCode: 404,
    },
    UserNotFound: {
      code: 24,
      message: "Username or password is not correct",
      httpStatusCode: 404,
    },
    UserUseAsFK: {
      code: 25,
      message: "Due to dependency can't delete the user",
      httpStatusCode: 409,
    },
    WrongCredential: {
      code: 26,
      message: "Username or password is not correct",
      httpStatusCode: 404,
    },
    UserExpired: {
      code: 27,
      message:
        "Dear user, your account has been deactivated. Please contact admin.",
      httpStatusCode: 404,
    },
    UserAlreadyExists: {
      code: 28,
      message: "The username is already taken",
      httpStatusCode: 404,
    },
    profilesNotFound: {
      code: 29,
      message: "Profile not found",
      httpStatusCode: 404,
    },
  },
  //-- baseInfoExceptions---
  baseInfo: {
    commonBaseTypeIdNotFound: {
      code: 30,
      message: "Common base type not found",
      httpStatusCode: 404,
    },
    commonBaseTypeIdUseAsFK: {
      code: 31,
      message: "Due to dependency can't delete item",
      httpStatusCode: 409,
    },
    baseTypeTitleUnique: {
      code: 32,
      message: "Title is already taken",
      httpStatusCode: 409,
    },
    baseTypeCodeUnique: {
      code: 33,
      message: "Generated code is already taken",
      httpStatusCode: 409,
    },
    baseDataUnique: {
      code: 34,
      message: "Base data is already taken",
      httpStatusCode: 409,
    },
    commonBaseDataIdNotFound: {
      code: 35,
      message: "Common base data not found",
      httpStatusCode: 404,
    },
    charityAccountCardNumber: {
      code: 36,
      message: "Charity account card number is already taken",
      httpStatusCode: 409,
    },
    charityAccountAccountNumber: {
      code: 37,
      message: "Charity account number is already taken",
      httpStatusCode: 409,
    },
    commonBaseDataIdUseAsFK: {
      code: 38,
      message: "Due to dependency can't delete common base data",
      httpStatusCode: 409,
    },
    charityAccountIdUseAsFK: {
      code: 39,
      message: "Due to dependency can't delete charity account",
      httpStatusCode: 409,
    },
  },

  //-- operationExceptions---
  operation: {
    overPayment: {
      code: 40,
      message: "The payment value is more than needed",
      httpStatusCode: 400,
    },
    wrongPayment: {
      code: 41,
      message:
        "There is not enough donators's payments to submit the settlement",
      httpStatusCode: 400,
    },
    wrongLoadDonator: {
      code: 42,
      message: "Donator is not specified",
      httpStatusCode: 404,
    },
    wrongLoadCharity: {
      code: 43,
      message: "Needy is not specified",
      httpStatusCode: 404,
    },
  },
  //-- planExceptions---
  beneficiary: {
    donatorError: {
      code: 44,
      message: "Donator with the this national code is already registered",
      httpStatusCode: 404,
    },
    needyError: {
      code: 45,
      message: "Needy with the this national code is already registered",
      httpStatusCode: 409,
    },
    personalError: {
      code: 46,
      message: "personnel with the this national code is already registered",
      httpStatusCode: 409,
    },
    personNotFound: {
      code: 47,
      message: "The person not found",
      httpStatusCode: 409,
    },
    shebaNumberUnique: {
      code: 48,
      message: "Needy SHEBA number is already taken",
      httpStatusCode: 409,
    },
    fieldsUniques: {
      code: 49,
      message: "Needy account number is already taken",
      httpStatusCode: 409,
    },
    compareAccountNumber: {
      code: 50,
      message: "SHEBA number and account number are irelevant",
      httpStatusCode: 409,
    },
  },
  //-- planExceptions---
  plan: {
    PlanNotFound: {
      code: 51,
      message: "Can't find plan with these specifications",
      httpStatusCode: 404,
    },
    PlanUseAsFK: {
      code: 52,
      message: "Due to dependency can't delete the plan",
      httpStatusCode: 409,
    },
    PlanFDateTDate: {
      code: 53,
      message: "Needy assignment must be in plan's timespan",
      httpStatusCode: 409,
    },
    notFound: {
      code: 54,
      message: "Needy to plan assignment not found",
      httpStatusCode: 409,
    },
    overMinPrice: {
      code: 55,
      message: "minimum  price is more than needed price",
      httpStatusCode: 409,
    },
    succorUnique: {
      code: 56,
      message:
        "Succor cash for the specified needy and plan is already created",
      httpStatusCode: 409,
    },
  },
  sqlInjection: {
    code: 57,
    message: "Invalid characters are detected in the request body",
    httpStatusCode: 401,
  },
  forgetMyPass: {
    NotAuthorized: {
      code: 47,
      message: "Username or password is incorrect",
      httpStatusCode: 401,
    },
  },
  bigBigFile: {
    code: 58,
    message: "Uploaded file must be less than 100kb",
    httpStatusCode: 401,
  },
  assignRole: {
    iamDonator: {
      code: 59,
      message: "Can't assign role to donator",
      httpStatusCode: 401,
    },
  },
  parentTime: {
    code: 60,
    message: "Plan's timespan must be between plan's parent timespan",
    httpStatusCode: 401,
  },
  middleware: {
    code: 62,
    message: "Middleware error",
    httpStatusCode: 500,
  },
  middlewareFileNotFound:{
    code: 63,
    message: "charityConfig.json file not found! please insert the file in config/network directory",
    httpStatusCode: 500,
  },
  targetNgoIsNull:{
    code: 64,
    message: "Target NGO name, Plan and Beneficiary hash codes are required!",
    httpStatusCode: 400,
  },
  settlementNullInputs:{
    code: 65,
    message: "Plan hash code, Needy hash code and type of payment approve/final settlement are requierd!",
    httpStatusCode: 400,
  },
  targetNgoNameIsNull: {
    code: 66,
    message: "For this settlement NGO's name is required",
    httpStatusCode: 400,
  },
};

module.exports = { GlobalExceptionsEn };
