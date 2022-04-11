
const cms = require('express').Router();
const accessPermission = require('../um/accessPermission/router/router');
const personal = require('../um/personal/router/router');
const role = require('../um/role/router/router');
const users = require('../um/user/router/router');

cms.use('/um/accessPermission', accessPermission);
cms.use('/um/personal', personal);
cms.use('/um/role', role);
cms.use('/um/user', users);

module.exports = cms;
