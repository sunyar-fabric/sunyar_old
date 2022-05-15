
'use strict';

const { Contract } = require('fabric-contract-api');
const { persianToTimestamp } = require('./utility/timestamp')
const crypto = require("crypto-js");
const uuid = require('uuid');

class PlanDefinition extends Contract {

    // CreateAsset issues a new asset(plan) to the world state with given details.
    async CreateAsset(ctx, planNameInput, ownerOrgNameInput, durationDateInput, parentPlanHashCode) {

        if (!planNameInput || !ownerOrgNameInput || !durationDateInput) {
            throw new Error('Input values cannot be empty')
        }
        //create key hash code
        let hashInput = planNameInput + ownerOrgNameInput;
        hashInput = await crypto.SHA256(hashInput);
        let planHashCode = await hashInput.toString();
        if (await this.AssetExists(ctx, planHashCode)) {
            throw new Error(`the plan ${planHashCode} already exists`)
        }

        //create DurationDate timestamp
        let date = durationDateInput.split('/')
        let durationDate = await persianToTimestamp(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]))

        //create planId
        let planId = uuid.v4()

        const asset = {
            PlanHashCode: planHashCode,
            ParentPlanHashCode: parentPlanHashCode,
            PlanName: planNameInput,
            OwnerOrgName: ownerOrgNameInput,
            DurationDate: durationDate,
        };

        await ctx.stub.putState(planId, Buffer.from(JSON.stringify(asset)));
        return JSON.stringify(asset);
    }

    // ReadAsset returns the asset stored in the world state with given id.
    async ReadAsset(ctx, beneficiaryHashCode) {
        const assetJSON = await ctx.stub.getState(beneficiaryHashCode); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${beneficiaryHashCode} does not exist`);
        }
        return assetJSON.toString();
    }

    // UpdateAsset updates an existing asset in the world state with provided parameters.
    async UpdateAsset(ctx, planNameInput, ownerOrgNameInput, durationDateInput) {
        const exists = await this.AssetExists(ctx, planHashCode);
        if (!exists) {
            throw new Error(`The asset ${planHashCode} does not exist`);
        }

        //create key hash code
        let hashInput = planNameInput + ownerOrgNameInput;
        hashInput = await crypto.SHA256(hashInput);
        let planHashCode = await hashInput.toString();

        //create DurationDate
        let date = []
        let durationDate = []
        date[0] = durationDateInput[0].split('/')
        date[1] = durationDateInput[1].split('/')
        durationDate[0] = await persianToTimestamp(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]))
        durationDate[1] = await persianToTimestamp(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]))

        // overwriting original asset with new asset
        const updatedAsset = {
            PlanHashCode: planHashCode,
            PlanName: planNameInput,
            OwnerOrgName: ownerOrgNameInput,
            DurationDate: durationDate,
        };
        return ctx.stub.putState(planHashCode, Buffer.from(JSON.stringify(updatedAsset)));
    }

    // DeleteAsset deletes an given asset from the world state.
    async DeleteAsset(ctx, planHashCode) {
        const exists = await this.AssetExists(ctx, planHashCode);
        if (!exists) {
            throw new Error(`The asset ${planHashCode} does not exist`);
        }
        return ctx.stub.deleteState(planHashCode);
    }

    // AssetExists returns true when asset with given planHashCode exists in world state.
    async AssetExists(ctx, planHashCode) {
        const assetJSON = await ctx.stub.getState(planHashCode);
        return assetJSON && assetJSON.length > 0;
    }

    // GetAllPlans returns all plans found in the world state.
    async GetAllPlans(ctx) {
        const plans = await this.getAllPlanByOwnerOrgNameProperty(ctx)
        return plans
    }

    async getAllPlanByOwnerOrgNameProperty(ctx) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.OwnerOrgName = {};
        queryString.selector.OwnerOrgName.$gt = null
        return await this.getQuery(ctx, queryString)
    }

    async getQuery(ctx, queryString) {
        let resultsIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let allResults = [];
        let res = await resultsIterator.next();
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                jsonRes.Key = res.value.key;
                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Record = res.value.value.toString('utf8');
                }
                allResults.push(jsonRes);
            }
            res = await resultsIterator.next();
        }
        resultsIterator.close();
        return allResults;

    }


}

module.exports = PlanDefinition;