
'use strict';
 
const State = require('../../ledger-api/state.js');
const opState = {
    Donated: "001",
    DonatedApproved: "002",
    Settled: "003",
};


class Operation extends State {

    constructor(obj) {
        super(Operation.getClass(), [obj.planHashCode, obj.beneficiaryHashCode, obj.dateTime]);
        Object.assign(this, obj);
    }

    getOwner() {
        return this.owner;
    }

    setOwnerMSP(mspid) {
        this.mspid = mspid;
    }

    getOwnerMSP() {
        return this.mspid;
    }

    setOwner(owner) {
        this.owner = owner;
    }

    setDonated() {
        this.currentState = opState.Donated;
    }

    setDonatedApproved() {
        this.currentState = opState.DonatedApproved;
    }

    setSettled() {
        this.currentState = opState.Settled;
    }

    static fromBuffer(buffer) {
        return Operation.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static deserialize(data) {
        return State.deserializeClass(data, Operation);
    }
    static createInstance(planHashCode, beneficiaryHashCode, amount, dateTime, sourceNgoName, targetNgoName, status, donerNationalCode) {
        console.log("THIS IS OBJ2", { planHashCode, beneficiaryHashCode, amount, dateTime, sourceNgoName, targetNgoName, status, donerNationalCode});
        return new Operation({ planHashCode, beneficiaryHashCode, amount, dateTime, sourceNgoName, targetNgoName, status, donerNationalCode});
    }

    static getClass() {
        return 'org.sunyar.operation';
    }
}

module.exports = Operation;
