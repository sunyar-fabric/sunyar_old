
'use strict';

const { Contract } = require('fabric-contract-api');
const { persianToTimestamp } = require('./utility/timestamp')
// import BeneficiaryToPlan  from '../../beneficiaryToPlan/lib/beneficiaryToPlan'
const { BeneficiaryToPlan } = require('../../beneficiaryToPlan/lib/beneficiaryToPlan');

class CashAssistanceDetail extends Contract {

    // CreateCashAssistance issues a new asset(plan) to the world state with given details.
    async CreateCashAssistance(ctx, planHashCode, beneficiaryHashCode, neededPrice, minPrice, description) {

        neededPrice = Number(neededPrice)
        minPrice = Number(minPrice)

        // Check minPrice
        if (minPrice > neededPrice) {
            return {
                status: "failed",
                msg: `minPrice can not be grater than neededPrice!`
            }
        }

        // Existence plan
        const planExists = await this.getPlanByPlanHashCodeProperty(ctx, planHashCode)
        if (planExists.length === 0) {
            return {
                status: "failed",
                msg: `the plan ${planHashCode} is not founded in the ledger!`
            }
        }

        // Existence beneficiary and validation
        if (beneficiaryHashCode) {
            const beneficiaryExists = await ctx.stub.getState(beneficiaryHashCode);
            if (beneficiaryExists.length == 0) {
                // throw new Error(`The beneficiary ${beneficiaryHashCode} is not founded in the ledger!`);
                return {
                    status: "failed",
                    msg: `The beneficiary ${beneficiaryHashCode} is not founded in the ledger!`
                }
            }
            if (beneficiaryExists[0].IsActive == false) {
                return {
                    status: "failed",
                    msg: `The beneficiary status is not valid!`
                }
            }
        }

        // Check assign needys to plan
        let assetJSON = await this.getBeneficiarysByPlanHashCodeProperty(ctx, planHashCode);
        if (assetJSON.length > 0) {
            if (!beneficiaryHashCode) {
                return {
                    status: "failed",
                    msg: `The beneficiaryHashCode for create cashAssistanceDetail is neccessery!`
                }
            }
            let beneficiarys = []
            for (const el of assetJSON) {
                beneficiarys.push(el.Record.beneficiaryHashCode)
            }
            const beneficiaryDidAssignToPlan = beneficiarys.includes(beneficiaryHashCode)
            if (!beneficiaryDidAssignToPlan) {
                return {
                    status: "failed",
                    msg: `The beneficiary ${beneficiaryHashCode} have not been assignd to this plan!`
                }
            }

        } else {
            if (beneficiaryHashCode) {
                return {
                    status: "failed",
                    msg: `To this plan is assigned no beneficiary!`
                }
            }
        }
        const key = assetJSON.length == 0 ? `${planHashCode}CashAssistanceDetail` : `${planHashCode}${beneficiaryHashCode}`
        const asset = {
            NeededPrice: neededPrice,
            MinPrice: minPrice,
            Description: description,
        };

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(asset)));
        return JSON.stringify({
            status: 'success',
            asset
        });
    }

    // ReadAsset returns the asset stored in the world state with given id.
    async ReadAsset(ctx, beneficiaryHashCode) {
        const assetJSON = await ctx.stub.getState(beneficiaryHashCode); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${beneficiaryHashCode} does not exist`);
        }
        return assetJSON.toString();
    }

    // UpdateCashAssistance updates an existing asset in the world state with provided parameters.
    async UpdateCashAssistance(ctx, planHashCode, beneficiaryHashCode, neededPrice, minPrice, description) {

        if (!planHashCode) {
            return {
                status: "failed",
                msg: `The planHashCode can not be empty!`,
            }
        }

        // Existence plan
        const planExists = await this.getPlanByPlanHashCodeProperty(ctx, planHashCode)
        if (planExists.length === 0) {
            return {
                status: "failed",
                msg: `the plan ${planHashCode} is not founded in the ledger!`
            }
        }

        // Existence assigning
        const beneficiaryToPlan = new BeneficiaryToPlan()
        const result = await beneficiaryToPlan.GetBeneficiarysByPlan(ctx, planHashCode, '', '')
        const { beneficiarys } = result

        let flag = true;
        for (let index = 0; index < beneficiarys.length; index++) {
            if (beneficiarys[index].beneficiaryHashCode == beneficiaryHashCode) {
                flag = false
                break
            }
        }
        if (flag) {
            return {
                status: "failed",
                msg: `This beneficiaryHashCode ${beneficiaryHashCode} is not assigned to the plan!`
            }
        }

        //Existence cashAssistance
        const key = planHashCode + beneficiaryHashCode;
        const cashAssistance = await this.AssetExists(ctx, key)
        if (!cashAssistance) {
            return {
                status: "failed",
                msg: `cashAssistance is not available in the world state with given info!`
            }
        }
        
        //create key hash code
        let hashInput = planNameInput + ownerOrgNameInput;
        hashInput = await crypto.SHA256(hashInput);
        // let planHashCode = await hashInput.toString();

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
    async AssetExists(ctx, key) {
        const assetJSON = await ctx.stub.getState(key);
        return assetJSON && assetJSON.length > 0;
    }

    // GetAllAssets returns all assets found in the world state.
    async GetAllAssets(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    async getAssetByKey(ctx, key) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.PlanHashCode = key;
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

    async getBeneficiarysByPlanHashCodeProperty(ctx, key) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.planHashCode = key;
        return await this.getQuery(ctx, queryString)
    }

    async getPlanByPlanHashCodeProperty(ctx, key) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.PlanHashCode = key;
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

module.exports = CashAssistanceDetail;