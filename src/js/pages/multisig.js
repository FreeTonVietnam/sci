`use strict`;

let converter = require('hex2dec');

let validator = require('../validator');
let modules = require('../modules/modules');
let TON = require('../modules/ton');
let supportedContracts = require('../consts/supportedContracts');

let multisigData = {};

/**
 * Connect to multisig address
 * @returns {Promise<void>}
 */
async function connectToMultisig() {
    if (!validator.addressValidate()) return modules.alertModal('Error', 'Incorrect address');
    try {
        modules.showHideSpinner('hide')
        let accData = await TON.getAccountData($("#address").val());
        if (!accData) throw new Error('Incorrect address');
        let contractName = Object.keys(supportedContracts).find(key => supportedContracts[key] === accData.parsed.code_hash);
        if (!contractName) throw new Error(`Unsupported smart contract`);
        multisigData = accData.parsed;
        await prepareDataForMultisign(contractName);
        return drawSecondMultisignPage();
    } catch (err) {
        modules.showHideSpinner('show')
        return modules.alertModal('Error', typeof err === 'object' ? err.message : err);
    }
}

/**
 * Prepare data for multisign
 * @param contractName
 * @returns any
 */
async function prepareDataForMultisign(contractName) {
    multisigData.address = multisigData.id;
    multisigData.abi = require(`../../../contracts_abi/${contractName}.abi.json`);
    multisigData.pubkey = (await TON.getPubKeyBySeed($("#seed").val())).public;
    multisigData.custodians = await TON.getCustodians(multisigData.abi, multisigData.address, multisigData.boc);
    multisigData.transactions = await TON.getTransactions(multisigData.abi, multisigData.address, multisigData.boc);
    multisigData.balance = parseFloat(converter.hexToDec(multisigData.balance) / 1000000000);
    multisigData.seed = $("#seed").val();
    multisigData.contractName = contractName;
    multisigData.isCustodian = (!Object.values(multisigData.custodians).find(key => key.pubkey === `0x${multisigData.pubkey}`)) ? false : true;
}

/**
 * Render second page data
 * @returns {Promise<void>}
 */
async function drawSecondMultisignPage() {
    $("#curAddress").html(multisigData.address);
    $("#balance").html(multisigData.balance);
    $("#status").html(multisigData.acc_type_name);
    $("#countOwners").html(multisigData.custodians.length);
    $("#isCustodian").html(multisigData.isCustodian ? 'Yes' : 'No');
    $("#contractName").html(multisigData.contractName);
    if (!multisigData.isCustodian) $("#createNewTransaction").attr('disabled', true);
    await updateTransactionsTable();
    $("#multisignFormOne").addClass('d-none');
    $("#multisignFormTwo").removeClass('d-none')
    modules.showHideSpinner('show')
}

/**
 * Submit new transaction
 * @returns {Promise<void>}
 */
async function createNewMultisignTransaction() {
    if (!($("#modalAddress").val().trim().match(/^(?:0|\-1)\:.{64}$/) !== null)) return modules.alertModal('Error', 'Incorrect address');
    try {
        modules.showHideSpinner('hide');
        if (parseFloat($("#modalAmount").val()) > parseFloat(multisigData.balance)) throw new Error('Incorrect balance');
        $('#transactionModal').modal('toggle');
        await TON.submitTransaction($('#modalBounce').is(":checked"), multisigData.address, multisigData.abi, multisigData.seed, $("#modalAddress").val(), $("#modalAmount").val() * 1000000000);
        await updateTransactionsTable();
        modules.showHideSpinner('show')
    } catch (err) {
        modules.showHideSpinner('show');
        return modules.alertModal('Error', typeof err === 'object' ? err.message : err);
    }
}

/**
 * Detect confirmed transactions by current user
 * @returns {Promise<void>}
 */
async function detectConfirmedTransactions() {
    let custodianIndex = multisigData.custodians.filter(el => (el.pubkey === `0x${multisigData.pubkey}`));
    for (let tr of multisigData.transactions) {
        if (custodianIndex[0] === undefined) return tr.confirmed = false;
        let isConfirmedMessage = await TON.encodeGetMessage(multisigData.abi, multisigData.address, 'isConfirmed', {
            mask: tr.confirmationsMask,
            index: custodianIndex[0].index
        });
        tr.confirmed = (await TON.runTvm(multisigData.abi, multisigData.boc, isConfirmedMessage.message)).confirmed;
    }
}

/**
 * Confirm transaction by button
 * @param el
 * @returns {Promise<void>}
 */
async function confirmTransaction(el) {
    modules.showHideSpinner('hide');
    await TON.confirmTransaction(multisigData.address, multisigData.abi, el.id, multisigData.seed);
    await updateTransactionsTable();
    modules.showHideSpinner('show');
    if (parseInt(el.signsReceived) + 1 === parseInt(el.signsRequired)) modules.alertModal('Success', 'Transaction send successfully');
}


/**
 * Update transactions table
 * @type bool
 * @returns {Promise<void>}
 */
async function updateTransactionsTable(type) {
    await updateTransactionsData(type);
    $("#transactionsTable > tbody").html("");
    await detectConfirmedTransactions();
    let tableContent = Array.from(multisigData.transactions, (el, iter) => {
        return `<tr>
        <td>${parseInt(iter) + 1}</td>
        <td>${el.dest}</td>
        <td>${(parseFloat(el.value) / 1000000000).toFixed(3)}</td>
        <td>${el.signsReceived} / ${el.signsRequired}</td>
        <td><a href="#" class="btn btn-secondary btn-sm ${((el.confirmed) || (!multisigData.isCustodian)) ? 'disabled' : ''}" onclick='confirmTransaction(${JSON.stringify(el)})'>Confirm</a></td>
        </tr>`
    }).join('')
    $('#transactionsTable > tbody').append(tableContent);
    if (type) modules.showHideSpinner('show');
}

/**
 * Update transactions & balance data
 * @param type
 * @returns {Promise<void>}
 */
async function updateTransactionsData(type) {
    if (type) modules.showHideSpinner('hide');
    let accData = await TON.getAccountData(multisigData.address);
    multisigData.boc = accData.parsed.boc;
    multisigData.balance = parseFloat(converter.hexToDec(accData.parsed.balance) / 1000000000);
    multisigData.transactions = await TON.getTransactions(multisigData.abi, multisigData.address, multisigData.boc);
    $("#balance").html(multisigData.balance);
}

module.exports = {
    createNewMultisignTransaction, updateTransactionsTable, confirmTransaction, connectToMultisig
}