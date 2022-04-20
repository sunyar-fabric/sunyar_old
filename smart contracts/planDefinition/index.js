/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const planDefinition = require('./lib/planDefinition.js');

module.exports.PlanDefinition = planDefinition;
module.exports.contracts = [planDefinition];
