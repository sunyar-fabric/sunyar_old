/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const { checkCartDigit } = require('./utility/validation.js');
const moment = require('jalali-moment')
const { error } =  require('./utility/error')
const { persianToTimestamp , timestampToPersian } = require('./utility/timestamp.js');
var uuid = require('uuid');



class AssetTransfer extends Contract {

    
    async InitLedger(ctx) {
        const assets = [
            {
                paymentId: "initialize1",
                title : "initialize1",
                cardNumber: "6219861023131609",
                price: 100,
                expireDate: "1400/12/24",
                description: "آغاز1" ,
            },
            {
                paymentId: "initialize2",
                title : "initialize2",
                cardNumber: "6219861023131609",
                price: 100,
                expireDate: "1400/12/24",
                description: "آغاز1" ,
            },
           
        ];

        for (const asset of assets) {
            asset.docType = 'asset';
            await ctx.stub.putState(asset.paymentId, Buffer.from(JSON.stringify(asset)));
            console.info(`Asset ${asset.paymentId} initialized`);
        }
    }

    // CreateAsset issues a new asset to the world state with given details.
    async CreateAsset(ctx, titleInput, cardNumberInput, priceInput , expireDateInput, descriptionInput) {
          //check card number
          if (! checkCartDigit(cardNumberInput)){
            //throw new Error(`The card number is wrong`);
            return JSON.stringify(error.cardNumber);
          }
          
          // generate unique Id     
          let paymentId = await uuid.v4()  
          //create expire date
          let date = expireDateInput.split('/')
          let expireDateInput = await persianToTimestamp(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]))
          
        const asset = {
            paymentId: paymentId,
            title : titleInput,
            cardNumber: cardNumberInput,
            price: priceInput,
            expireDate: expireDateInput,
            description: descriptionInput,
        };
        ctx.stub.putState(paymentId, Buffer.from(JSON.stringify(asset)));
        return JSON.stringify(asset);
    }

    // ReadAsset returns the asset stored in the world state with given id.
    async ReadAsset(ctx, paymentId) {
        const assetJSON = await ctx.stub.getState(paymentId); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            //throw new Error(`The asset ${paymentId} does not exist`);
            return JSON.stringify(error.dontExist)
        }
        return assetJSON.toString();
    }

    
    // DeleteAsset deletes an given asset from the world state.
    async DeleteAsset(ctx, paymentId) {
        const exists = await this.AssetExists(ctx, paymentId);
        if (!exists) {
            //throw new Error(`The asset ${paymentId} does not exist`);
            return JSON.stringify(error.dontExist)
        }
        return ctx.stub.deleteState(paymentId);
    }

    // AssetExists returns true when asset with given ID exists in world state.
    async AssetExists(ctx, paymentId) {
        const assetJSON = await ctx.stub.getState(paymentId);
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
