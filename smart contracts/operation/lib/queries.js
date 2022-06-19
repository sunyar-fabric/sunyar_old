
'use strict';

const State = require('../ledger-api/state.js');

class QueryUtils {

    constructor(ctx, listName, supported_classes={}) {
        this.ctx = ctx;
        this.name = listName;
        this.supportedClasses = supported_classes;
    }

    async getAssetHistory(issuer, paperNumber) {

        let ledgerKey = await this.ctx.stub.createCompositeKey(this.name, [issuer, paperNumber]);
        const resultsIterator = await this.ctx.stub.getHistoryForKey(ledgerKey);
        let results = await this.getAllResults(resultsIterator, true);

        return results;
    }

    async queryKeyByPartial(assetspace) {

        if (arguments.length < 1) {
            throw new Error('Incorrect number of arguments. Expecting 1');
        }

        const resultsIterator = await this.ctx.stub.getStateByPartialCompositeKey(this.name, [assetspace]);
        let method = this.getAllResults;
        let results = await method(resultsIterator, false);

        return results;
    }

    async queryKeyByOwner(owner) {
        //  
        let self = this;
        if (arguments.length < 1) {
            throw new Error('Incorrect number of arguments. Expecting owner name.');
        }
        let queryString = {};
        queryString.selector = {};
        queryString.selector.owner = owner;
        let method = self.getQueryResultForQueryString;
        let queryResults = await method(this.ctx, self, JSON.stringify(queryString));
        return queryResults;
    }

    async getAssetHistory(issuer, paperNumber) {

        let ledgerKey = await this.ctx.stub.createCompositeKey(this.name, [issuer, paperNumber]);
        const resultsIterator = await this.ctx.stub.getHistoryForKey(ledgerKey);
        let results = await this.getAllResults(resultsIterator, true);

        return results;
    }


    async queryKey_operation(planHashCode, beneficiaryHashCode, status) {
        let self = this;
        if (arguments.length < 1) {
            throw new Error('Incorrect number of arguments. Expecting owner name.');
        }
        let queryString = {};
        queryString.selector = {};
        queryString.selector.$and = [];

        queryString.selector.$and.push({planHashCode});
        queryString.selector.$and.push({status});
        queryString.selector.$and.push({beneficiaryHashCode});
        let method = self.getQueryResultForQueryString;
        let queryResults = await method(this.ctx, self, JSON.stringify(queryString));
        return queryResults;
    }

    async query_main(query_args) { 
        let self = this;
        if (arguments.length < 1) {
            throw new Error('Incorrect number of arguments. Expecting owner name.');
        }
        let queryString = {};
        queryString.selector = {};
        queryString.selector.$and = [];
        for(let key of Object.keys(query_args)){
            let _key = key;
            queryString.selector.$and.push({[key]: query_args[key]});
        }
        let method = self.getQueryResultForQueryString;
        let queryResults = await method(this.ctx, self, JSON.stringify(queryString));
        return queryResults;
    }

    async getState_by_key(listName, keys) { 
        let ledgerKey = '';
        //ledgerKey = this.ctx.stub.createCompositeKey(listName, key); //this must use composite key for sure!
        for(let key of keys){ //this shall be removed!
            ledgerKey += key;
        }
        let data = await this.ctx.stub.getState(ledgerKey);
        if (data && data.toString('utf8')) {
            // let state = State.deserialize(data, this.supportedClasses //trash
                // );
            return JSON.parse(data);
        } else {
            return null;
        }
    }

    async queryByAdhoc(queryString) {

        if (arguments.length < 1) {
            throw new Error('Incorrect number of arguments. Expecting ad-hoc string, which gets stringified for mango query');
        }
        let self = this;

        if (!queryString) {
            throw new Error('queryString must not be empty');
        }
        let method = self.getQueryResultForQueryString;
        let queryResults = await method(this.ctx, self, JSON.stringify(queryString));
        return queryResults;
    }

    async getQueryResultForQueryString(ctx, self, queryString) {
        const resultsIterator = await ctx.stub.getQueryResult(queryString);
        let results = await self.getAllResults(resultsIterator, false);

        return results;

    }

    async getAllResults(iterator, isHistory) {
        let allResults = [];
        let res = { done: false, value: null };

        while (true) {
            res = await iterator.next();
            let jsonRes = {};
            if (res.value && res.value.value.toString()) {
                if (isHistory && isHistory === true) {
                    // jsonRes.TxId = res.value.tx_id;
                    jsonRes.TxId = res.value.txId;
                    jsonRes.Timestamp = res.value.timestamp;
                    jsonRes.Timestamp = new Date((res.value.timestamp.seconds.low * 1000));
                    let ms = res.value.timestamp.nanos / 1000000;
                    jsonRes.Timestamp.setMilliseconds(ms);
                    if (res.value.is_delete) {
                        jsonRes.IsDelete = res.value.is_delete.toString();
                    } else {
                        try {
                            jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                            switch (jsonRes.Value.currentState) {
                                case 1:
                                    jsonRes.Value.currentState = 'ISSUED';
                                    break;
                                case 2:
                                    jsonRes.Value.currentState = 'PENDING';
                                    break;
                                case 3:
                                    jsonRes.Value.currentState = 'TRADING';
                                    break;
                                case 4:
                                    jsonRes.Value.currentState = 'REDEEMED';
                                    break;
                                default: // else, unknown named query
                                    jsonRes.Value.currentState = 'UNKNOWN';
                            }

                        } catch (err) {
                            console.log(err);
                            jsonRes.Value = res.value.value.toString('utf8');
                        }
                    }
                } else { // non history query ..
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }
            // check to see if we have reached the end
            if (res.done) {
                // explicitly close the iterator 
                console.log('iterator is done');
                await iterator.close();
                return allResults;
            }

        }  // while true
    }

}
module.exports = QueryUtils;
