'use strict';

let {TonClient} = require('@tonclient/core');
let {libWeb} = require('@tonclient/lib-web');

TonClient.useBinaryLibrary(libWeb);

let client = new TonClient({
    network: {
        server_address: 'main.ton.dev'
    }
});

module.exports = {

    /**
     * Change client
     * @param server_address
     * @returns {Promise<void>}
     */
    async changeClient(server_address) {
        if (client.config.network.server_address === server_address) return;
        client = new TonClient({
            network: {
                server_address
            }
        });
    },

    /**
     * Get list of custodians
     * @param abi
     * @param address
     * @param boc
     * @param functionName
     * @returns {Promise<*>}
     */
    async callGetMethod(abi, address, boc, functionName) {
        let {message} = await this.encodeGetMessage(abi, address, functionName);
        return (await this.runTvm(abi, boc, message));
    },

    /**
     * Encode get message
     * @param abi
     * @param address
     * @param function_name
     * @param input
     * @param signer
     * @returns {Promise<void>}
     */
    async encodeGetMessage(abi, address, function_name, input = {}, signer = {type: 'None'}) {
        const call_set = {function_name, input};
        return await client.abi.encode_message({
            abi: {
                type: 'Contract',
                value: abi
            },
            address,
            call_set,
            signer
        })
    },

    /**
     * Run tvm
     * @param abi
     * @param boc
     * @param message
     * @returns {Promise<any>}
     */
    async runTvm(abi, boc, message) {
        const resultOfRunTvm = await client.tvm.run_tvm({message, account: boc});
        const result = await client.abi.decode_message({
            abi: {
                type: 'Contract',
                value: abi
            },
            message: resultOfRunTvm.out_messages[0]
        });
        return result.value;
    },

    /**
     * Process message
     */
    async processMessage(address, abi, input = {}, function_name, phrase) {
        let keys = (phrase === '') ? null : await client.crypto.mnemonic_derive_sign_keys({phrase});
        let signer = (keys === null) ? {type: 'None'} : {type: 'Keys', keys};
        const params = {
            send_events: false,
            message_encode_params: {
                address,
                abi: {
                    type: 'Contract',
                    value: abi
                },
                call_set: {
                    function_name,
                    input
                },
                signer
            },
        };
        return (await client.processing.process_message(params))
    },

    /**
     * Get boc of address
     * @returns {Promise<{balance: bigint, boc: string | BocModule}>}
     */
    async getBoc(address) {
        let {result} = await client.net.query_collection({
            collection: 'accounts',
            filter: {id: {eq: address}},
            result: 'boc balance(format: DEC)'
        });
        if (!result.length) return false;
        return result[0].boc
    },

    /**
     * Get account data;
     * @param address
     * @returns {Promise<ResultOfParse>}
     */
    async getAccountData(address) {
        let boc = await module.exports.getBoc(address);
        if (!boc) return false;
        return await client.boc.parse_account({boc});
    },

    /**
     * Get public key by seed phrase
     * @param phrase
     * @returns {Promise<KeyPair|{public: boolean}>}
     */
    async getPubKeyBySeed(phrase) {
        return await client.crypto.mnemonic_derive_sign_keys({
            phrase
        }).catch(_ => ({public: false}))
    },

    /**
     * Get list of custodians
     * @param abi
     * @param address
     * @param boc
     * @returns {Promise<*>}
     */
    async getCustodians(abi, address, boc) {
        let getCustodiansMessage = await module.exports.encodeGetMessage(abi, address, 'getCustodians');
        return (await module.exports.runTvm(abi, boc, getCustodiansMessage.message)).custodians;
    },

    /**
     * Get list of transactions
     * @param abi
     * @param address
     * @param boc
     * @returns {Promise<*>}
     */
    async getTransactions(abi, address, boc) {
        const getCustodiansMessage = await module.exports.encodeGetMessage(abi, address, 'getTransactions');
        return (await module.exports.runTvm(abi, boc, getCustodiansMessage.message)).transactions;
    },

    /**
     * Submit transaction
     * @param bounce
     * @param address
     * @param abi
     * @param phrase
     * @param dest
     * @param value
     * @returns {Promise<*>}
     */
    async submitTransaction(bounce, address, abi, phrase, dest, value) {
        let input = {
            dest,
            value: value,
            bounce: bounce,
            allBalance: false,
            payload: ""
        };
        return (await module.exports.processMessage(address, abi, input, 'submitTransaction', phrase))
    },

    /**
     * Confirm transactions
     * @param address
     * @param abi
     * @param id
     * @param phrase
     * @returns {Promise<void>}
     */
    async confirmTransaction(address, abi, id, phrase) {
        return (await module.exports.processMessage(address, abi, {transactionId: id}, 'confirmTransaction', phrase))
    }
}