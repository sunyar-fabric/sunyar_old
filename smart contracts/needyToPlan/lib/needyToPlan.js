

'use strict';

const { Contract } = require('fabric-contract-api');
const { persianToTimestamp } = require('./utility/timestamp')

class NeedyToPlan extends Contract {

    // CreateAsset issues a new asset(needyToPlan) to the world state with given details.
    async CreateAsset(ctx, planHashCode, beneficiary) {

        const beneficiaryObj = JSON.parse(beneficiary)
        const { beneficiaryHashCode: beneficiaryHashList, beneficiaryDuration } = beneficiaryObj
        console.log('------',beneficiaryHashList,'--------');
        //Existance plan
        // const planExists = await this.AssetExists(ctx, planHashCode)
        // if (!planExists) {
        //     throw new Error('planHashCode is not founded in the ledger!')
        // }

        // //Existance needy

        // let invalidBeneficiaryList = []
        // for (let beneficiaryHashCode of beneficiaryObj?.beneficiaryHashCode) {
        //     let beneficiaryExists = await this.AssetExists(ctx, beneficiaryHashCode)
        //     if (!beneficiaryExists) {
        //         invalidBeneficiaryList.push(beneficiaryHashCode)
        //     }
        // }
        // if (invalidBeneficiaryList.length > 0) {
        //     return {
        //         InvalidBeneficiaryHashList: invalidBeneficiaryList
        //     }
        // }

        // //create beneficiaryDuration timestamp
        // let date = beneficiaryObj?.beneficiaryDuration.split('/')
        // let beneficiaryDuration = persianToTimestamp(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]))

        // const asset = {
        //     needysList: beneficiaryObj?.beneficiaryHashCode,
        //     beneficiaryDuration,
        // };

        // await ctx.stub.putState(planHashCode, Buffer.from(JSON.stringify(asset)));
        // // const assignedNeedysToPlan = await ctx.stub.putState(planHashCode, Buffer.from(JSON.stringify(asset)));
        // // AssigneNeedyToPlan = JSON.parse(AssigneNeedyToPlan.toString())
        // // console.log('-------------****------------', assignedNeedysToPlan);
        // return 'Needys successfully are assigned to plan';
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
    async UpdateAsset(ctx, nationalCodeInput, birthDateInput, isActiveInput) {
        const exists = await this.AssetExists(ctx, beneficiaryHashCode);
        if (!exists) {
            throw new Error(`The asset ${beneficiaryHashCode} does not exist`);
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

    // AssetExists returns true when asset with given planHashCode exists in world state.
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


}

module.exports = NeedyToPlan;
