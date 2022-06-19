'use strict';

const StateList = require('../ledger-api/statelist.js');

const Operation = require('./operation.js');

class OperationList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.sunyar.operation');
        this.use(Operation);
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
