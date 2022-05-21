/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const cashAssistanceDetail = require('./lib/cashAssistanceDetail');

module.exports.CashAssistanceDetail = cashAssistanceDetail;
module.exports.contracts = [cashAssistanceDetail];
