/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const beneficiary = require('./lib/beneficiary');

module.exports.Beneficiary = beneficiary;
module.exports.contracts = [beneficiary];
