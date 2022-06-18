/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const opContract = require('./lib/operationContract');

module.exports.Operation = opContract;
module.exports.contracts = [opContract];