const GlobalExceptions = {
  operation: {
    common: {
      inputError: {
        code: 1,
        message: "Invalid null inputs for operation",
        httpStatusCode: 400,
      }, nullTargetNgoName: {
        code: 2,
        message: "Invalid null-targetNgoName input for operation",
        httpStatusCode: 400,
      }, nullDonerNationalCode: {
        code: 3,
        message: "Invalid null-donerNationalCode input for operation",
        httpStatusCode: 400,
      }, nationalCode: {
        code: 4,
        message: "Invalid national-code input for operation",
        httpStatusCode: 400,
      }, dateTime: {
        code: 5,
        message: "Invalid date-time input for operation. 5 minutes TIMEOUT!",
        httpStatusCode: 400,
      }, beneficiaryNotFound: {
        code: 6,
        message: "Beneficiary not found!",
        httpStatusCode: 400,
      }, beneficiaryNotAllocated: {
        code: 7,
        message: "Beneficiary is not allocated to this plan",
        httpStatusCode: 400,
      }
      ,InvalidNationalCode: {
        code: 8,
        message: "Invalid national code",
        httpStatusCode: 400,
      }

    },
    payment: {
      notEnough: {
        code: 9,
        message: "Payment is NOT enough for this beneficiary",
        httpStatusCode: 400,
      }, moreThanExpected: {
        code: 10,
        message: "Payment is more than expected",
        httpStatusCode: 400,
      }
    },
    approvement: {
      moreThanNeededPrice: {
        code: 11,
        message: "Payment-approving is more than needed price",
        httpStatusCode: 400,
      }, notEnough: {
        code: 12,
        message: "Payment-approving is NOT enough for this beneficiary",
        httpStatusCode: 400,
      }
    },
    settlement: {
      notEnoughApprovement: {
        code: 13,
        message: "Payment-settle there is NOT enough approvement for this amount!",
        httpStatusCode: 400,
      }, notEnoughDonation: {
        code: 14,
        message: "Payment-settle there is NOT enough donations for this beneficiary to be settled!",
        httpStatusCode: 400,
      }
    }
  },

};
module.exports = { GlobalExceptions };
