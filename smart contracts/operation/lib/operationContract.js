/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const Operation = require('./operation.js');
const OperationList = require('./operationList.js');
const QueryUtils = require('./queries.js');
const {checkCodeMeli} = require("../utility/validation");
const {v4} = require("uuid");


/**
 * A custom context provides easy access to list of all commercial papers
 */
class OperationContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.operationList = new OperationList(this);
    }

}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class OperationContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.sunyar.operation');
    }

    /**
     * Define a custom context for commercial paper
    */
    createContext() {
        return new OperationContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract?');
    }


    async CreateOperation(ctx, planHashCode, beneficiaryHashCode, amount, dateTime, sourceNgoName, targetNgoName, status, donerNationalCode) {
        if (!planHashCode || !beneficiaryHashCode || !amount || !sourceNgoName || !status || !dateTime) {
            throw new Error(`Invalid null inputs for operation`);
        }
        if (!targetNgoName && status != "002") {
            throw new Error(`Invalid null-targetNgoName input for operation`);
        }
        if (!donerNationalCode && status == "001") {
            throw new Error(`Invalid null-donerNationalCode input for operation`);
        }
        if(!checkCodeMeli(donerNationalCode) && status=="001"){
            throw new Error(`Invalid national-code input for operation`);
        }

        let now = new Date().getTime();
        const five_min = 5 * 60 * 1000;
        if (Number(dateTime) + five_min < now) {
            throw new Error(`Invalid date-time input for operation. 5 minutes TIMEOUT! \nyourdate-time:${dateTime}\nnow:${now}`);
        }

        //init utils
        let query = new QueryUtils(ctx, 'org.sunyar.operation', {Operation});
        let beneficiary = await query.query_main({beneficiaryHashCode});// i made a beneficiary based on Operation class but when all contracts are done remove || Operation  ----> shut-up
        if (!beneficiary) throw new Error(`Beneficiary not found!`);
        let beneficiaryToPlan = await query.query_main({ planHashCode, beneficiaryHashCode, class: "org.sunyar.beneficiartyToPlan" });
        console.log("*************beneficiaryToPlan****************", beneficiaryToPlan); 
        if (!beneficiaryToPlan || beneficiaryToPlan.length == 0) throw new Error(`Beneficiary is not allocated to this plan`);//cashAssistanceList+"plan"+"ben"
        beneficiaryToPlan = beneficiaryToPlan[0].Record;//cashAssistanceListasdlfkjbadskjf
        let cash_assistance = await query.query_main({BeneficiaryHashCode:beneficiaryHashCode, PlanHashCode:planHashCode, class: "org.sunyar.x"});
        console.log("*************cash_assistance****************", cash_assistance); 
        let minPrice = cash_assistance[0].Record.MinPrice;
        let neededPrice = cash_assistance[0].Record.NeededPrice;
        let donated_operations = await query.query_main({planHashCode, beneficiaryHashCode, currentState: "001"});
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
        //****if op is settled
        // Smart contract, rather than paper, moves paper into ISSUED state
        let operation;
        switch (status) {
            case "001":
                operation = Operation.createInstance(planHashCode, beneficiaryHashCode, amount, dateTime, sourceNgoName, targetNgoName, status, donerNationalCode);
                //****if op is going to be donated... 
                //check if beneficiary is in the plan to beneficiary list
                //get cash-assistance of beneficiray
                //get all donations for this plan and beneficiary
                //A = needed price
                //B = min price
                //C = all donated with
                // let A=(B=(C=0));
                if (amount < minPrice) throw new Error(`Payment is NOT enough for this beneficiary min is: `, minPrice);
                if (amount + all_donated > neededPrice) throw new Error(`Payment is more than expected: `, neededPrice);
                operation.setDonated();
                console.log("donations");
                break;
            case "002":
                //****if op is going to be DonatedApproved
                operation = Operation.createInstance(planHashCode, beneficiaryHashCode, amount, dateTime, sourceNgoName, "",status, "");
                // let operationKey = Operation.makeKey(["org.sunyar.operation",planHashCode, beneficiaryHashCode, dateTimeQuery]); //payment time is saved already in backend DB!
                // operation = await ctx.operationList.getOperation(operationKey);
                console.log("*************all minPrice*************", minPrice);
                console.log("*************all amount*************", amount);
                amount = Number(amount);
                if (amount + all_donations_approved > neededPrice) throw new Error(`Payment-approving is more than needed price: `, minPrice);
                if (amount + all_donations_approved > all_donated) throw new Error(`Payment-approving is NOT enough for this beneficiary`);
                operation.setDonatedApproved();
                break;
            case "003":
                //****if op is going to be settled
                //get all approved-donation-operrations source to beneficiary --> D
                //get all settled-operations from every charity to source charity --> A
                //get all settled-operations from target charity to source charity --> B
                //get all donation-operations in target charity --> C
                amount = Number(amount);
                operation = Operation.createInstance(planHashCode, beneficiaryHashCode, amount, dateTime, sourceNgoName, targetNgoName,status, "");
                all_donations_approved;//D
                let settled_operations = await query.query_main({planHashCode, beneficiaryHashCode, currentState: "003", sourceNgoName});
                let all_settled = 0;//A
                for(let s_op of settled_operations){
                    all_settled += Number(s_op.Record.amount);
                }
                console.log("*************all_settled*************", all_settled);
                let settled_operations_target = await query.query_main({planHashCode, beneficiaryHashCode, currentState: "003", sourceNgoName, targetNgoName});
                let all_settled_target = 0;//B
                for(let s_op_t of settled_operations_target){
                    all_settled_target += Number(s_op_t.Record.amount);
                }
                //????
                console.log("*************all_settled_target*************", all_settled_target);
                let donation_operations_target = await query.query_main({planHashCode, beneficiaryHashCode, currentState: "001", sourceNgoName, targetNgoName});
                let all_donation_target = 0;//C
                for(let s_op_t of donation_operations_target){
                    all_donation_target += Number(s_op_t.Record.amount);
                }
                if(amount + all_settled > all_donations_approved) {throw new Error(`Payment-settle there is NOT enough approvement for this amount!`)}
                if(amount + all_settled_target > all_donations_approved) {throw new Error(`Payment-settle there is NOT enough approvement for this amount!`)}
                if(amount + all_settled_target > all_donation_target) {throw new Error(`Payment-settle there is NOT enough donations for this beneficiary to be settled!`)} //history??

                operation.setSettled();
                break;
        }

        // save the owner's MSP 
        let mspid = ctx.clientIdentity.getMSPID();
        operation.setOwnerMSP(mspid);

        // Newly issued paper is owned by the issuer to begin with (recorded for reporting purposes)
        operation.setOwner(sourceNgoName);


        // Add the paper to the list of all similar commercial papers in the ledger world state
        await ctx.operationList.addOperation(operation);
        //set tracking-code mrs vahidi said 
        operation.tracking_code = v4();
        // Must return a serialized paper to caller of smart contract
        return operation;
    }

}

module.exports = OperationContract;
