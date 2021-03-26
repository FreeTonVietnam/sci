'use strict';

let modules = require('./modules');

/**
 * Check on exist prop name & type at inputs & outputs of ABI functions
 * @param data
 * @returns {boolean}
 */
function checkAbiFunctions(data) {
    for (let val of Object.values(data)) {
        if ((!val.name) || (!val.type)) return false;
    }
    return true;
}

module.exports = {

    /**
     * Validate address
     * @param _
     */
    addressValidate: _ => ($("#address").val().trim().match(/^(?:0|\-1)\:.{64}$/) !== null),

    /**
     * ABI validate
     * @param _
     * @returns {Promise<boolean>}
     */
    abiValidate: async _ => {
        try {
            let abi = JSON.parse(await modules.getAbi());
            if (typeof(abi.functions) !== 'object') return false;
            for (let val of Object.values(abi.functions)){
                if ((!val.name) || (typeof(val.inputs) !== 'object') || (typeof(val.outputs) !== 'object')) return false;
                if ((!checkAbiFunctions(val.inputs)) || (!checkAbiFunctions(val.outputs))) return false;
            }
        } catch {
            return false;
        }
    },
}