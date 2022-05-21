/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const beneficiaryToPlan = require('./lib/beneficiaryToPlan');

module.exports.BeneficiaryToPlan = beneficiaryToPlan;
module.exports.contracts = [beneficiaryToPlan];
