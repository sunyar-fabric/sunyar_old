/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../../ledger-api/stateList.js');

const Operation = require('./operation.js');

class OperationList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.sunyar.operation');
        this.use(Operation); // set supported classes for the list
    }

    async addOperation(operation) {
        return this.addState(operation);
    }

    async getOperation(operationKey) {
        return this.getState(operationKey);
    }

    async updateOperation(operation) {
        return this.updateState(operation);
    }
}


module.exports = OperationList;
