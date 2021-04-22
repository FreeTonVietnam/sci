`use strict`;

let validator = require('../validator');
let modules = require('../modules/modules');
let TON = require('../modules/ton');

/**
 * Main func
 * @returns {Promise<void>}
 */
async function connectToAbi() {
    if ((!validator.addressValidate()) || (await validator.abiValidate() === false)) return modules.alertModal('Error', 'Incorrect data');
    let abi = JSON.parse(await modules.getAbi());
    await drawABIFunctions(abi);
}


/**
 * Draw abi functions
 * @param abi
 * @param row
 * @returns {Promise<void>}
 */
async function drawABIFunctions(abi, row = "") {
    $(".info-block").empty();
    for (let abiFunction of Object.values(abi.functions)) {
        if (abiFunction.name === 'constructor') continue;
        row = modules.prepareRowForDrawAbi(abiFunction, row)
    }
    $(".info-block").append(row);
}


/**
 * Call ABI function of sol contract
 * @param functionName
 * @returns {Promise<void>}
 */
async function callABIFunction(functionName) {
    try {
        await TON.changeClient($('input[name="rd"]:checked').val());
        modules.showHideSpinner('hide')
        let abi = JSON.parse(await modules.getAbi());
        let data = modules.getABIFunctionParams(functionName);
        let address = $("#address").val().trim();
        let res = (!Object.keys(data).length) ? await TON.callGetMethod(abi, address, await TON.getBoc(address), functionName) :
            await TON.processMessage(address, abi, data, functionName, $("#seed").val().split('—').join(' '));
        modules.showHideSpinner('show')
        $('#modalBody').html(JSON.stringify(res));
        $('#mainModal').modal('show');
    } catch (err) {
        modules.showHideSpinner('show')
        return modules.alertModal('Error', typeof err === 'object' ? err.message : err);
    }
}

module.exports = {
    callABIFunction, connectToAbi
}