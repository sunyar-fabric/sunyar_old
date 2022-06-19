'use strict';

const { Contract, Context } = require('fabric-contract-api');

const Operation = require('./operation.js');
const OperationList = require('./operationList.js');
const QueryUtils = require('./queries.js');
const { checkCodeMeli } = require("../utility/validation");
const { v4 } = require("uuid");
const { GlobalExceptions } = require('../utility/exceptions.js');

class OperationContext extends Context {
    constructor() {
        super();
        this.operationList = new OperationList(this);
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    }


}

class OperationContract extends Contract {

    constructor() {                   
        super('org.sunyar.operation');
    }

    createContext() {
        return new OperationContext();
    }

    async instantiate(ctx) {

        console.log('Instantiate the contract?');
    }


    async CreateOperation(ctx, planHashCode, beneficiaryHashCode, amount, dateTime, sourceNgoName, targetNgoName, status, donerNationalCode) {
        if (!planHashCode || !beneficiaryHashCode || !amount || !sourceNgoName || !status || !dateTime) {
            return GlobalExceptions.operation.common.inputError;
        }
        if (!targetNgoName && status != "002") {
            return GlobalExceptions.operation.common.nullTargetNgoName;
        }
        if (!donerNationalCode && status == "001") {
            return GlobalExceptions.operation.common.nullDonerNationalCode;
        }
        if (!checkCodeMeli(donerNationalCode) && status == "001") {
            return GlobalExceptions.operation.common.InvalidNationalCode;
        }
        let now = new Date().getTime();
        const five_min = 5 * 60 * 1000;
        //if (Number(dateTime) + five_min < now) {
           // return GlobalExceptions.operation.common.dateTime
       // }

        let query = new QueryUtils(ctx, 'org.sunyar.operation', { Operation });
        let beneficiary = await query.query_main({ beneficiaryHashCode, class: "org.sunyar.beneficiary.x" });
        if (!beneficiary) return GlobalExceptions.operation.common.beneficiaryNotFound;
        let beneficiaryToPlan = await query.query_main({ planHashCode, beneficiaryHashCode, class: "org.sunyar.beneficiaryToPlan.x"});
        console.log("*************beneficiaryToPlan****************", beneficiaryToPlan);
        if (!beneficiaryToPlan || beneficiaryToPlan.length == 0) return GlobalExceptions.operation.common.beneficiaryNotAllocated
        beneficiaryToPlan = beneficiaryToPlan[0].Record;
        let cash_assistance = await query.query_main({ beneficiaryHashCode, planHashCode, class: "org.sunyar.cashAssistance.x" });
        console.log("*************cash_assistance****************", cash_assistance);
        if (!cash_assistance || cash_assistance.length == 0) return GlobalExceptions.operation.common.cashAssistanceNotDefined
        let minPrice = cash_assistance[0].Record.minPrice;
        let neededPrice = cash_assistance[0].Record.neededPrice;
        let donated_operations = await query.query_main({ planHashCode, beneficiaryHashCode, currentState: "001" });
        let all_donated = 0;
        for (let d_op of donated_operations) {
            all_donated += Number(d_op.Record.amount);
        }
        console.log("*************all_donated****************", all_donated);

        let donations_approved = await query.query_main({ planHashCode, beneficiaryHashCode, currentState: "002", sourceNgoName, class: "org.sunyar.operation" });
        let all_donations_approved = 0;
        for (let d_ap of donations_approved) {
            all_donations_approved += Number(d_ap.Record.amount);
        }
        console.log("*************donations_approved****************", all_donations_approved);
        let operation_donation;
        let operation_approved;
        let operation_settled;
        amount = Number(amount);
        neededPrice = Number(neededPrice);
        switch (status) {
            case "001":
                operation_donation = Operation.createInstance(planHashCode, beneficiaryHashCode, amount, dateTime, sourceNgoName, targetNgoName, status, donerNationalCode);
                if (amount < minPrice) return GlobalExceptions.operation.payment.notEnough
                if (amount + all_donated > neededPrice) return GlobalExceptions.operation.payment.moreThanExpected
                operation_donation.setDonated();
                break;
            case "002":
                operation_approved = Operation.createInstance(planHashCode, beneficiaryHashCode, amount, dateTime, sourceNgoName, "", status, "");
                console.log("*************minPrice*************", minPrice);
                console.log("*************amount*************", amount);
                if (amount + all_donations_approved > neededPrice) return GlobalExceptions.operation.approvement.moreThanNeededPrice
                if (amount + all_donations_approved > all_donated) return GlobalExceptions.operation.approvement.notEnough
                operation_approved.totalPaymentPrice = all_donated;
                operation_approved.setDonatedApproved();
                operation_settled = Operation.createInstance(planHashCode, beneficiaryHashCode, amount, Number(dateTime)+1, sourceNgoName, targetNgoName, "003", "");
                all_donations_approved;
                let settled_operations = await query.query_main({ planHashCode, beneficiaryHashCode, currentState: "003", sourceNgoName });
                let all_settled = 0;
                for (let s_op of settled_operations) {
                    all_settled += Number(s_op.Record.amount);
                }
                console.log("*************all_settled*************", all_settled);
                let settled_operations_target = await query.query_main({ planHashCode, beneficiaryHashCode, currentState: "003", sourceNgoName, targetNgoName });
                let all_settled_target = 0;
                for (let s_op_t of settled_operations_target) {
                    all_settled_target += Number(s_op_t.Record.amount);
                }
                console.log("*************all_settled_target*************", all_settled_target);
                let donation_operations_target = await query.query_main({ planHashCode, beneficiaryHashCode, currentState: "001", sourceNgoName, targetNgoName });
                let all_donation_target = 0;
                for (let s_op_t of donation_operations_target) {
                    all_donation_target += Number(s_op_t.Record.amount);
                }
                // all_donations_approved += amount; 
                if (all_settled > all_donations_approved) { return GlobalExceptions.operation.settlement.notEnoughApprovement }
                if (all_settled_target > all_donations_approved) { return GlobalExceptions.operation.settlement.notEnoughApprovement }
                if (amount + all_settled_target > all_donation_target) { return GlobalExceptions.operation.settlement.notEnoughDonation }

                operation_settled.setSettled();
                break;
        }

        let mspid = ctx.clientIdentity.getMSPID();
        if (operation_donation) {
            operation_donation.setOwnerMSP(mspid);
            operation_donation.setOwner(sourceNgoName);
            await ctx.operationList.addOperation(operation_donation);
            operation_donation.trackingCode = v4();
            return operation_donation;
        }
        else if (operation_approved && operation_settled) {
            operation_approved.setOwnerMSP(mspid);
            operation_approved.setOwner(sourceNgoName);
            operation_settled.setOwnerMSP(mspid);
            operation_settled.setOwner(sourceNgoName);
            await ctx.operationList.addOperation(operation_approved);
            await ctx.operationList.addOperation(operation_settled);
            operation_approved.trackingCode = v4();
            operation_settled.trackingCode = v4();
            return operation_approved;
        }
        else{
            return GlobalExceptions.operation.common.operationFailed
        }

    }

}

module.exports = OperationContract;
