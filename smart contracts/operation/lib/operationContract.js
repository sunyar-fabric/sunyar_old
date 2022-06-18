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
    }

}

class OperationContract extends Contract {

    constructor() {
        super('org.sunyar.operation');
    }

    teContext() {
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
        if (Number(dateTime) + five_min < now) {
            return GlobalExceptions.operation.common.dateTime
        }

        let query = new QueryUtils(ctx, 'org.sunyar.operation', { Operation });
        let beneficiary = await query.query_main({ beneficiaryHashCode });
        if (!beneficiary) return GlobalExceptions.operation.common.beneficiaryNotFound;
        let beneficiaryToPlan = await query.query_main({ planHashCode, beneficiaryHashCode, class: "org.sunyar.beneficiartyToPlan" });
        console.log("*************beneficiaryToPlan****************", beneficiaryToPlan);
        if (!beneficiaryToPlan || beneficiaryToPlan.length == 0) return GlobalExceptions.operation.common.beneficiaryNotAllocated
        beneficiaryToPlan = beneficiaryToPlan[0].Record;
        let cash_assistance = await query.query_main({ BeneficiaryHashCode: beneficiaryHashCode, PlanHashCode: planHashCode, class: "org.sunyar.cashAssistance" });
        console.log("*************cash_assistance****************", cash_assistance);
        let minPrice = cash_assistance[0].Record.MinPrice;
        let neededPrice = cash_assistance[0].Record.NeededPrice;
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
        let operation;
        amount = Number(amount);
        switch (status) {
            case "001":
                operation = Operation.createInstance(planHashCode, beneficiaryHashCode, amount, dateTime, sourceNgoName, targetNgoName, status, donerNationalCode);
                if (amount < minPrice) return GlobalExceptions.operation.payment.notEnough
                if (amount + all_donated > neededPrice) return GlobalExceptions.operation.payment.moreThanExpected
                operation.setDonated();
                break;
            case "002":
                operation = Operation.createInstance(planHashCode, beneficiaryHashCode, amount, dateTime, sourceNgoName, "", status, "");
                console.log("*************minPrice*************", minPrice);
                console.log("*************amount*************", amount);
                if (amount + all_donations_approved > neededPrice) return GlobalExceptions.operation.approvement.moreThanNeededPrice
                if (amount + all_donations_approved > all_donated) return GlobalExceptions.operation.approvement.notEnough
                operation.totalPaymentPrice = all_donated;
                operation.setDonatedApproved();
                break;
            case "003":
                operation = Operation.createInstance(planHashCode, beneficiaryHashCode, amount, dateTime, sourceNgoName, targetNgoName, status, "");
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
                if (amount + all_settled > all_donations_approved) { return GlobalExceptions.operation.settlement.notEnoughApprovement }
                if (amount + all_settled_target > all_donations_approved) { return GlobalExceptions.operation.settlement.notEnoughApprovement }
                if (amount + all_settled_target > all_donation_target) { return GlobalExceptions.operation.settlement.notEnoughDonation }

                operation.setSettled();
                break;
        }

        let mspid = ctx.clientIdentity.getMSPID();
        operation.setOwnerMSP(mspid);

        operation.setOwner(sourceNgoName);


        await ctx.operationList.addOperation(operation);
        operation.trackingCode = v4();
        return operation;
    }

}

module.exports = OperationContract;
