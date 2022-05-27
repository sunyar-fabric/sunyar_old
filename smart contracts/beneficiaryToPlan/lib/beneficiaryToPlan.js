
'use strict';

const { Contract } = require('fabric-contract-api');
const { persianToTimestamp } = require('./utility/timestamp')
const crypto = require("crypto-js");
const _ = require('lodash');

class BeneficiaryToPlan extends Contract {

    // CreateBeneficiaryToPlan issues a new asset(needyToPlan) to the world state with given details.
    async CreateBeneficiaryToPlan(ctx, planHashCode, beneficiary) {
        const beneficiaryObj = JSON.parse(beneficiary)
        let { beneficiaryHashCode: beneficiaryHashList, beneficiaryDuration } = beneficiaryObj

        // Existance plan
        const planExists = await this.getPlanByPlanHashCodeProperty(ctx, planHashCode)
        if (planExists.length === 0) {
            return {
                status: "failed",
                msg: `this plan ${planHashCode} is not founded in the ledger!`,
            }
        }

        //Existance needy
        let invalidBeneficiaryList = []
        for (let beneficiaryHashCode of beneficiaryHashList) {
            let beneficiaryExists = await this.AssetExists(ctx, beneficiaryHashCode)
            if (!beneficiaryExists) {
                invalidBeneficiaryList.push(beneficiaryHashCode)
            }
        }
        if (invalidBeneficiaryList.length > 0) {
            return {
                status: "failed",
                msg: "The Beneficiarys are not founded in the ledger",
                InvalidBeneficiaryHashList: invalidBeneficiaryList
            }
        }

        //create beneficiaryDuration timestamp
        let date = beneficiaryDuration.split('/')
        beneficiaryDuration = persianToTimestamp(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]))

        // Get beneficiarys are assigned to the plan
        const beneficiarys = await this.getBeneficiarysByPlanHashCodeProperty(ctx, planHashCode)
        if (beneficiarys.length !== 0) {
            let oldBeneficiarys = []
            for (const element of beneficiarys) {
                oldBeneficiarys.push(element.Record.beneficiaryHashCode)
            }
            const newBeneficiarys = _.difference(beneficiaryHashList, oldBeneficiarys)
            if (newBeneficiarys.length > 0) {
                for (let needy of newBeneficiarys) {
                    let assetJSON = await ctx.stub.getState(needy);
                    assetJSON = JSON.parse(assetJSON.toString())
                    if (assetJSON?.IsActive == false) {
                        invalidBeneficiaryList.push(needy)
                    }
                }
                if (invalidBeneficiaryList.length > 0) {
                    return {
                        status: "failed",
                        msg: "The Beneficiary is deactive",
                        InvalidBeneficiaryHashList: invalidBeneficiaryList
                    }
                }
                oldBeneficiarys.map(needy => newBeneficiarys.push(needy))
                beneficiaryHashList = [...newBeneficiarys]
            } else {
                return {
                    status: "failed",
                    msg: `The BeneficiaryHashList already added to this plan(${planHashCode})`
                }
            }
        }

        for (let beneficiaryHash of beneficiaryHashList) {
            let key = `${beneficiaryHash}${planHashCode}`
            const asset = {
                beneficiaryDuration,
                planHashCode,
                beneficiaryHashCode: beneficiaryHash
            }
            await ctx.stub.putState(key, Buffer.from(JSON.stringify(asset)));
        }
        const asset = {
            msg: "operation is done",
            InvalidBeneficiaryHashList: []
        }
        return JSON.stringify(asset);
    }

    // GetBeneficiaryToPlan returns the asset stored in the world state with given planHashCode.
    async GetBeneficiarysByPlan(ctx, planHashCode, planName, ownerOrgName) {

        if (!planHashCode && !planName && !ownerOrgName) {
            throw new Error(`input values can not be empty!`);
        }

        let hashInput = planName + ownerOrgName
        hashInput = await crypto.SHA256(hashInput);
        hashInput = hashInput.toString();
        const hash = planName && ownerOrgName ? hashInput : planHashCode

        // Existance plan
        const planExists = await this.getPlanByPlanHashCodeProperty(ctx, hash)
        if (planExists.length === 0) {
            return {
                status: "failed",
                msg: `this plan ${hash} is not founded in the ledger!`,
            }
        }

        let assetJSON = await this.getBeneficiarysByPlanHashCodeProperty(ctx, hash);

        if (assetJSON.length > 0) {
            let beneficiarysList = []
            for (const el of assetJSON) {
                beneficiarysList.push(el.Record.beneficiaryHashCode)
            }
            let result = {}
            result.beneficiarys = []
            for (const el of beneficiarysList) {
                let assetJSON = await ctx.stub.getState(`${hash}${el}`);
                result.beneficiarys.push({
                    beneficiaryHashCode: el,
                    cashAssistanceDetail: assetJSON.toString()
                })
            }
            return result
        } else {
            return { msg: `No beneficiary have been assigned to this plan ${hash}` }
        }
    }

    // UpdateBeneficiaryToPlan updates an existing asset in the world state with provided parameters.
    async UpdateBeneficiaryToPlan(ctx, planHashCode, nationalCodeInput, birthDateInput, isActiveInput) {

        const exists = await this.AssetExists(ctx, beneficiaryHashCode);

        if (!exists) {
            return {
                status: "failed",
                msg: `this plan ${planHashCode} is not founded in the ledger!`,
            }
        }

        if (!checkCodeMeli(nationalCodeInput)) {
            throw new Error(`The national code is wrong`);
        }
        //create key hash code
        let hashInput = nationalCodeInput + birthDateInput;
        hashInput = await crypto.SHA256(hashInput);
        let beneficiaryHashCode = await hashInput.toString();

        // generate unique Id     
        let beneficiaryId = await uuid.v4()
        //create BirthDate
        let date = birthDateInput.split('/')
        let birthDate = await persianToTimestamp(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]))

        //set IsActive boolean type
        if (isActiveInput == "true") {
            isActiveInput = Boolean(true)
        } else {
            isActiveInput = Boolean(false)
        }
        // overwriting original asset with new asset
        const updatedAsset = {
            BeneficiaryHashCode: beneficiaryHashCode,
            NationalCode: nationalCodeInput,
            BeneficiaryId: beneficiaryId,
            BirthDate: birthDate,
            IsActive: isActiveInput,
        };
        return ctx.stub.putState(beneficiaryHashCode, Buffer.from(JSON.stringify(updatedAsset)));
    }

    // DeleteAsset deletes an given asset from the world state.
    async DeleteAsset(ctx, beneficiaryHashCode) {
        const exists = await this.AssetExists(ctx, beneficiaryHashCode);
        if (!exists) {
            throw new Error(`The asset ${beneficiaryHashCode} does not exist`);
        }
        return ctx.stub.deleteState(beneficiaryHashCode);
    }

    // AssetExists returns true when asset with given id exists in world state.
    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
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

    // async getAssetByKey(ctx, key) {
    //     let queryString = {};
    //     queryString.selector = {};
    //     queryString.selector.PlanHashCode = key;
    //     let resultsIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    //     let allResults = [];
    //     let res = await resultsIterator.next();
    //     while (!res.done) {
    //         if (res.value && res.value.value.toString()) {
    //             let jsonRes = {};
    //             jsonRes.Key = res.value.key;
    //             try {
    //                 jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
    //             } catch (err) {
    //                 console.log(err);
    //                 jsonRes.Record = res.value.value.toString('utf8');
    //             }
    //             allResults.push(jsonRes);
    //         }
    //         res = await resultsIterator.next();
    //     }
    //     resultsIterator.close();
    //     return allResults;
    // }

    async getPlanByPlanHashCodeProperty(ctx, key) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.PlanHashCode = key;
        return await this.getQuery(ctx, queryString)
    }

    async getBeneficiarysByPlanHashCodeProperty(ctx, key) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.planHashCode = key;
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

module.exports.BeneficiaryToPlan = BeneficiaryToPlan;