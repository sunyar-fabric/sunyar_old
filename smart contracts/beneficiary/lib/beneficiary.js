/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const { checkCodeMeli } = require('./utility/validation.js');
const moment = require('jalali-moment')
const { persianToTimestamp , timestampToPersian } = require('./utility/timestamp.js');
const crypto = require("crypto-js");
var uuid = require('uuid');



class AssetTransfer extends Contract {

    async InitLedger(ctx) {
        const assets = [
            {
                BeneficiaryHashCode: "initialize1",
                NationalCode: "0078539889",
                BeneficiaryId: "_1",
                BirthDate: "_1",
                IsActive: "true" ,
            },
            {
                BeneficiaryHashCode: "initialize2",
                NationalCode: "0078539889",
                BeneficiaryId: "_1",
                BirthDate: "_1",
                IsActive: "true" ,
            },
           
        ];

        for (const asset of assets) {
            asset.docType = 'asset';
            await ctx.stub.putState(asset.BeneficiaryHashCode, Buffer.from(JSON.stringify(asset)));
            console.info(`Asset ${asset.BeneficiaryHashCode} initialized`);
        }
    }

    // CreateAsset issues a new asset to the world state with given details.
    async CreateAsset(ctx, nationalCodeInput, birthDateInput, isActiveInput) {
          //check national code
          if (! checkCodeMeli(nationalCodeInput)){
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
          if(isActiveInput == "true"){
            isActiveInput = Boolean(true)
          }else {
            isActiveInput = Boolean(false)
          }

        const asset = {
            BeneficiaryHashCode: beneficiaryHashCode,
            NationalCode: nationalCodeInput,
            BeneficiaryId: beneficiaryId,
            BirthDate: birthDate,
            IsActive: isActiveInput,
        };
        ctx.stub.putState(beneficiaryHashCode, Buffer.from(JSON.stringify(asset)));
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
    async UpdateAsset(ctx, nationalCodeInput, birthDateInput, isActiveInput) {
        const exists = await this.AssetExists(ctx, beneficiaryHashCode);
        if (!exists) {
            throw new Error(`The asset ${beneficiaryHashCode} does not exist`);
        }

        if (! checkCodeMeli(nationalCodeInput)){
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
          if(isActiveInput == "true"){
            isActiveInput = Boolean(true)
          }else {
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

    // AssetExists returns true when asset with given ID exists in world state.
    async AssetExists(ctx, beneficiaryHashCode) {
        const assetJSON = await ctx.stub.getState(beneficiaryHashCode);
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

module.exports = AssetTransfer;
