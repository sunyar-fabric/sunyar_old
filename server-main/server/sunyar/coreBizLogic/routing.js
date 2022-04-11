const express = require('express');
const  router = express()

const  commonBaseTypeRouter = require('../baseInfo/commonBaseType/router/router');
const  commonBaseDataRouter = require('../baseInfo/commonBaseData/router/router');
const  charityAccountsRouter = require('../baseInfo/charityAccounts/router/router');
const  needyAccountsRouter = require('../beneficiary/needyAccounts/router/router');
const  planRouter = require('../plan/plan/router/router');
const  needyToPlanRouter = require('../plan/needyToPlan/router/router');
const  succorCashRouter = require('../plan/succorCash/router/router');
const  paymentRouter = require('../operation/payment/router/router');
const  settelmentRouter = require('../operation/settelment/router/router');
 
router.use('/baseInfo/commonBaseType', commonBaseTypeRouter);
router.use('/baseInfo/commonBaseData', commonBaseDataRouter);
router.use('/baseInfo', commonBaseDataRouter);
router.use('/baseInfo/charityAccounts', charityAccountsRouter);
router.use('/beneficiary/needyAccounts', needyAccountsRouter);
router.use('/plan/plan', planRouter);
router.use('/plan/needyToPlan', needyToPlanRouter);
router.use('/plan/succorCash', succorCashRouter);
router.use('/operation/payment', paymentRouter);
router.use('/operation/settelment', settelmentRouter);
router.use('/operation', settelmentRouter);

module.exports = router;