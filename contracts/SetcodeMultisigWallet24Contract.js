//
// This file was generated using TON Labs developer tools.
//

const abi = {
	"ABI version": 2,
	"header": ["pubkey", "time", "expire"],
	"functions": [
		{
			"name": "constructor",
			"inputs": [
				{"name":"owners","type":"uint256[]"},
				{"name":"reqConfirms","type":"uint8"}
			],
			"outputs": [
			]
		},
		{
			"name": "acceptTransfer",
			"inputs": [
				{"name":"payload","type":"bytes"}
			],
			"outputs": [
			]
		},
		{
			"name": "sendTransaction",
			"inputs": [
				{"name":"dest","type":"address"},
				{"name":"value","type":"uint128"},
				{"name":"bounce","type":"bool"},
				{"name":"flags","type":"uint8"},
				{"name":"payload","type":"cell"}
			],
			"outputs": [
			]
		},
		{
			"name": "submitTransaction",
			"inputs": [
				{"name":"dest","type":"address"},
				{"name":"value","type":"uint128"},
				{"name":"bounce","type":"bool"},
				{"name":"allBalance","type":"bool"},
				{"name":"payload","type":"cell"}
			],
			"outputs": [
				{"name":"transId","type":"uint64"}
			]
		},
		{
			"name": "confirmTransaction",
			"inputs": [
				{"name":"transactionId","type":"uint64"}
			],
			"outputs": [
			]
		},
		{
			"name": "isConfirmed",
			"inputs": [
				{"name":"mask","type":"uint32"},
				{"name":"index","type":"uint8"}
			],
			"outputs": [
				{"name":"confirmed","type":"bool"}
			]
		},
		{
			"name": "getParameters",
			"inputs": [
			],
			"outputs": [
				{"name":"maxQueuedTransactions","type":"uint8"},
				{"name":"maxCustodianCount","type":"uint8"},
				{"name":"expirationTime","type":"uint64"},
				{"name":"minValue","type":"uint128"},
				{"name":"requiredTxnConfirms","type":"uint8"},
				{"name":"requiredUpdConfirms","type":"uint8"}
			]
		},
		{
			"name": "getTransaction",
			"inputs": [
				{"name":"transactionId","type":"uint64"}
			],
			"outputs": [
				{"components":[{"name":"id","type":"uint64"},{"name":"confirmationsMask","type":"uint32"},{"name":"signsRequired","type":"uint8"},{"name":"signsReceived","type":"uint8"},{"name":"creator","type":"uint256"},{"name":"index","type":"uint8"},{"name":"dest","type":"address"},{"name":"value","type":"uint128"},{"name":"sendFlags","type":"uint16"},{"name":"payload","type":"cell"},{"name":"bounce","type":"bool"}],"name":"trans","type":"tuple"}
			]
		},
		{
			"name": "getTransactions",
			"inputs": [
			],
			"outputs": [
				{"components":[{"name":"id","type":"uint64"},{"name":"confirmationsMask","type":"uint32"},{"name":"signsRequired","type":"uint8"},{"name":"signsReceived","type":"uint8"},{"name":"creator","type":"uint256"},{"name":"index","type":"uint8"},{"name":"dest","type":"address"},{"name":"value","type":"uint128"},{"name":"sendFlags","type":"uint16"},{"name":"payload","type":"cell"},{"name":"bounce","type":"bool"}],"name":"transactions","type":"tuple[]"}
			]
		},
		{
			"name": "getTransactionIds",
			"inputs": [
			],
			"outputs": [
				{"name":"ids","type":"uint64[]"}
			]
		},
		{
			"name": "getCustodians",
			"inputs": [
			],
			"outputs": [
				{"components":[{"name":"index","type":"uint8"},{"name":"pubkey","type":"uint256"}],"name":"custodians","type":"tuple[]"}
			]
		},
		{
			"name": "submitUpdate",
			"inputs": [
				{"name":"codeHash","type":"uint256"},
				{"name":"owners","type":"uint256[]"},
				{"name":"reqConfirms","type":"uint8"}
			],
			"outputs": [
				{"name":"updateId","type":"uint64"}
			]
		},
		{
			"name": "confirmUpdate",
			"inputs": [
				{"name":"updateId","type":"uint64"}
			],
			"outputs": [
			]
		},
		{
			"name": "executeUpdate",
			"inputs": [
				{"name":"updateId","type":"uint64"},
				{"name":"code","type":"cell"}
			],
			"outputs": [
			]
		},
		{
			"name": "getUpdateRequests",
			"inputs": [
			],
			"outputs": [
				{"components":[{"name":"id","type":"uint64"},{"name":"index","type":"uint8"},{"name":"signs","type":"uint8"},{"name":"confirmationsMask","type":"uint32"},{"name":"creator","type":"uint256"},{"name":"codeHash","type":"uint256"},{"name":"custodians","type":"uint256[]"},{"name":"reqConfirms","type":"uint8"}],"name":"updates","type":"tuple[]"}
			]
		}
	],
	"data": [
	],
	"events": [
		{
			"name": "TransferAccepted",
			"inputs": [
				{"name":"payload","type":"bytes"}
			],
			"outputs": [
			]
		}
	]
};

const pkg = {
    abi,
    imageBase64: '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',
};

class SetcodeMultisigWallet24Contract {
    /**
    * @param {TONClient} client
    * @param {string} address can be null if contract will be deployed
    * @param {TONKeyPairData} keys
    */
    constructor(client, address, keys) {
        this.client = client;
        this.address = address;
        this.keys = keys;
        this.package = pkg;
        this.abi = abi;
    }

    /**
     * @param {object} constructorParams
     * @param {string[]} constructorParams.owners (uint256[])
     * @param {number} constructorParams.reqConfirms (uint8)
     */
    async deploy(constructorParams) {
        if (!this.keys) {
            this.keys = await this.client.crypto.ed25519Keypair();
        }
        this.address = (await this.client.contracts.deploy({
            package: pkg,
            constructorParams,
            initParams: {},
            keyPair: this.keys,
        })).address;
    }

    /**
    * @param {string} functionName
    * @param {object} input
    * @return {Promise.<object>}
    */
    async run(functionName, input) {
        const result = await this.client.contracts.run({
            address: this.address,
            functionName,
            abi,
            input,
            keyPair: this.keys,
        });
        return result.output;
    }

   /**
    * @param {string} functionName
    * @param {object} input
    * @return {Promise.<object>}
    */
    async runLocal(functionName, input) {
        const result = await this.client.contracts.runLocal({
            address: this.address,
            functionName,
            abi,
            input,
            keyPair: this.keys,
        });
        return result.output;
    }

    /**
     * @param {object} params
     * @param {bytes} params.payload
     */
    acceptTransfer(params) {
        return this.run('acceptTransfer', params);
    }

    /**
     * @param {object} params
     * @param {bytes} params.payload
     */
    acceptTransferLocal(params) {
        return this.runLocal('acceptTransfer', params);
    }

    /**
     * @param {object} params
     * @param {string} params.dest (address)
     * @param {uint128} params.value
     * @param {bool} params.bounce
     * @param {number} params.flags (uint8)
     * @param {cell} params.payload
     */
    sendTransaction(params) {
        return this.run('sendTransaction', params);
    }

    /**
     * @param {object} params
     * @param {string} params.dest (address)
     * @param {uint128} params.value
     * @param {bool} params.bounce
     * @param {number} params.flags (uint8)
     * @param {cell} params.payload
     */
    sendTransactionLocal(params) {
        return this.runLocal('sendTransaction', params);
    }

    /**
     * @typedef SetcodeMultisigWallet24Contract_submitTransaction
     * @type {object}
     * @property {uint64} transId 
     */

    /**
     * @param {object} params
     * @param {string} params.dest (address)
     * @param {uint128} params.value
     * @param {bool} params.bounce
     * @param {bool} params.allBalance
     * @param {cell} params.payload
     * @return {Promise.<SetcodeMultisigWallet24Contract_submitTransaction>}
     */
    submitTransaction(params) {
        return this.run('submitTransaction', params);
    }

    /**
     * @param {object} params
     * @param {string} params.dest (address)
     * @param {uint128} params.value
     * @param {bool} params.bounce
     * @param {bool} params.allBalance
     * @param {cell} params.payload
     * @return {Promise.<SetcodeMultisigWallet24Contract_submitTransaction>}
     */
    submitTransactionLocal(params) {
        return this.runLocal('submitTransaction', params);
    }

    /**
     * @param {object} params
     * @param {uint64} params.transactionId
     */
    confirmTransaction(params) {
        return this.run('confirmTransaction', params);
    }

    /**
     * @param {object} params
     * @param {uint64} params.transactionId
     */
    confirmTransactionLocal(params) {
        return this.runLocal('confirmTransaction', params);
    }

    /**
     * @typedef SetcodeMultisigWallet24Contract_isConfirmed
     * @type {object}
     * @property {bool} confirmed 
     */

    /**
     * @param {object} params
     * @param {number} params.mask (uint32)
     * @param {number} params.index (uint8)
     * @return {Promise.<SetcodeMultisigWallet24Contract_isConfirmed>}
     */
    isConfirmed(params) {
        return this.run('isConfirmed', params);
    }

    /**
     * @param {object} params
     * @param {number} params.mask (uint32)
     * @param {number} params.index (uint8)
     * @return {Promise.<SetcodeMultisigWallet24Contract_isConfirmed>}
     */
    isConfirmedLocal(params) {
        return this.runLocal('isConfirmed', params);
    }

    /**
     * @typedef SetcodeMultisigWallet24Contract_getParameters
     * @type {object}
     * @property {number} maxQueuedTransactions  (uint8)
     * @property {number} maxCustodianCount  (uint8)
     * @property {uint64} expirationTime 
     * @property {uint128} minValue 
     * @property {number} requiredTxnConfirms  (uint8)
     * @property {number} requiredUpdConfirms  (uint8)
     */

    /**
     * @return {Promise.<SetcodeMultisigWallet24Contract_getParameters>}
     */
    getParameters() {
        return this.run('getParameters', {});
    }

    /**
     * @return {Promise.<SetcodeMultisigWallet24Contract_getParameters>}
     */
    getParametersLocal() {
        return this.runLocal('getParameters', {});
    }

    /**
     * @typedef SetcodeMultisigWallet24Contract_getTransaction
     * @type {object}
     * @property {tuple} trans 
     */

    /**
     * @param {object} params
     * @param {uint64} params.transactionId
     * @return {Promise.<SetcodeMultisigWallet24Contract_getTransaction>}
     */
    getTransaction(params) {
        return this.run('getTransaction', params);
    }

    /**
     * @param {object} params
     * @param {uint64} params.transactionId
     * @return {Promise.<SetcodeMultisigWallet24Contract_getTransaction>}
     */
    getTransactionLocal(params) {
        return this.runLocal('getTransaction', params);
    }

    /**
     * @typedef SetcodeMultisigWallet24Contract_getTransactions
     * @type {object}
     * @property {tuple[]} transactions 
     */

    /**
     * @return {Promise.<SetcodeMultisigWallet24Contract_getTransactions>}
     */
    getTransactions() {
        return this.run('getTransactions', {});
    }

    /**
     * @return {Promise.<SetcodeMultisigWallet24Contract_getTransactions>}
     */
    getTransactionsLocal() {
        return this.runLocal('getTransactions', {});
    }

    /**
     * @typedef SetcodeMultisigWallet24Contract_getTransactionIds
     * @type {object}
     * @property {uint64[]} ids 
     */

    /**
     * @return {Promise.<SetcodeMultisigWallet24Contract_getTransactionIds>}
     */
    getTransactionIds() {
        return this.run('getTransactionIds', {});
    }

    /**
     * @return {Promise.<SetcodeMultisigWallet24Contract_getTransactionIds>}
     */
    getTransactionIdsLocal() {
        return this.runLocal('getTransactionIds', {});
    }

    /**
     * @typedef SetcodeMultisigWallet24Contract_getCustodians
     * @type {object}
     * @property {tuple[]} custodians 
     */

    /**
     * @return {Promise.<SetcodeMultisigWallet24Contract_getCustodians>}
     */
    getCustodians() {
        return this.run('getCustodians', {});
    }

    /**
     * @return {Promise.<SetcodeMultisigWallet24Contract_getCustodians>}
     */
    getCustodiansLocal() {
        return this.runLocal('getCustodians', {});
    }

    /**
     * @typedef SetcodeMultisigWallet24Contract_submitUpdate
     * @type {object}
     * @property {uint64} updateId 
     */

    /**
     * @param {object} params
     * @param {string} params.codeHash (uint256)
     * @param {string[]} params.owners (uint256[])
     * @param {number} params.reqConfirms (uint8)
     * @return {Promise.<SetcodeMultisigWallet24Contract_submitUpdate>}
     */
    submitUpdate(params) {
        return this.run('submitUpdate', params);
    }

    /**
     * @param {object} params
     * @param {string} params.codeHash (uint256)
     * @param {string[]} params.owners (uint256[])
     * @param {number} params.reqConfirms (uint8)
     * @return {Promise.<SetcodeMultisigWallet24Contract_submitUpdate>}
     */
    submitUpdateLocal(params) {
        return this.runLocal('submitUpdate', params);
    }

    /**
     * @param {object} params
     * @param {uint64} params.updateId
     */
    confirmUpdate(params) {
        return this.run('confirmUpdate', params);
    }

    /**
     * @param {object} params
     * @param {uint64} params.updateId
     */
    confirmUpdateLocal(params) {
        return this.runLocal('confirmUpdate', params);
    }

    /**
     * @param {object} params
     * @param {uint64} params.updateId
     * @param {cell} params.code
     */
    executeUpdate(params) {
        return this.run('executeUpdate', params);
    }

    /**
     * @param {object} params
     * @param {uint64} params.updateId
     * @param {cell} params.code
     */
    executeUpdateLocal(params) {
        return this.runLocal('executeUpdate', params);
    }

    /**
     * @typedef SetcodeMultisigWallet24Contract_getUpdateRequests
     * @type {object}
     * @property {tuple[]} updates 
     */

    /**
     * @return {Promise.<SetcodeMultisigWallet24Contract_getUpdateRequests>}
     */
    getUpdateRequests() {
        return this.run('getUpdateRequests', {});
    }

    /**
     * @return {Promise.<SetcodeMultisigWallet24Contract_getUpdateRequests>}
     */
    getUpdateRequestsLocal() {
        return this.runLocal('getUpdateRequests', {});
    }

}

SetcodeMultisigWallet24Contract.package = pkg;

module.exports = SetcodeMultisigWallet24Contract;
