
'use strict';
 
// Utility class for ledger state
const State = require('../../ledger-api/state.js');
// Enumerate commercial paper state values
const opState = {
    Donated: "001",
    DonatedApproved: "002",
    Settled: "003",
};

/**
 * CommercialPaper class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class Operation extends State {

    constructor(obj) {
        super(Operation.getClass(), [obj.planHashCode, obj.beneficiaryHashCode, obj.dateTime]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */
    // getIssuer() {
    //     return this.issuer;
    // }

    // setIssuer(newIssuer) {
    //     this.issuer = newIssuer;
    // }

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

    /**
     * Useful methods to encapsulate commercial paper states
     */
    setDonated() {
        this.currentState = opState.Donated;
    }

    setDonatedApproved() {
        this.currentState = opState.DonatedApproved;
    }

    setSettled() {
        this.currentState = opState.Settled;
    }

    // setPending() {
    //     this.currentState = cpState.PENDING;
    // }

    // isIssued() {
    //     return this.currentState === cpState.ISSUED;
    // }

    // isTrading() {
    //     return this.currentState === cpState.TRADING;
    // }

    // isRedeemed() {
    //     return this.currentState === cpState.REDEEMED;
    // }

    // isPending() {
    //     return this.currentState === cpState.PENDING;
    // }

    static fromBuffer(buffer) {
        return Operation.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to operation
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Operation);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(planHashCode, beneficiaryHashCode, amount, dateTime, sourceNgoName, targetNgoName, status, donerNationalCode) {
        console.log("THIS IS OBJ2", { planHashCode, beneficiaryHashCode, amount, dateTime, sourceNgoName, targetNgoName, status, donerNationalCode});
        return new Operation({ planHashCode, beneficiaryHashCode, amount, dateTime, sourceNgoName, targetNgoName, status, donerNationalCode});
    }

    static getClass() {
        return 'org.sunyar.operation';
    }
}

module.exports = Operation;
