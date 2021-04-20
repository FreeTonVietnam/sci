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
        return drawTransactionsPage();
    } catch (err) {
        modules.showHideSpinner('show');
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
    multisigData.seed = $("#seed").val().split('—').join(' ');
    multisigData.pubkey = (await TON.getPubKeyBySeed(multisigData.seed)).public;
    multisigData.custodians = await TON.callRunTvm(multisigData.abi, multisigData.address, multisigData.boc, 'getCustodians', 'custodians');
    multisigData.transactions = await TON.callRunTvm(multisigData.abi, multisigData.address, multisigData.boc, 'getTransactions', 'transactions');
    multisigData.balance = parseFloat(converter.hexToDec(multisigData.balance) / 1000000000);
    multisigData.contractName = contractName;
    multisigData.isCustodian = (!Object.values(multisigData.custodians).find(key => key.pubkey === `0x${multisigData.pubkey}`)) ? false : true;
}

/**
 * Render second page data
 * @returns {Promise<void>}
 */
async function drawTransactionsPage(type) {
    if (type) modules.showHideSpinner('hide');
    if (multisigData.isCustodian) {
        $("#transactionModalTriggerParent").removeClass('disabled');
        $("#custodiansModalTriggerParent").removeClass('disabled');
    }
    $("#ownersTableContent").addClass('d-none');
    $("#curAddress").html(multisigData.address);
    $("#balance").html(multisigData.balance);
    $("#status").html(multisigData.acc_type_name);
    $("#countOwners").html(multisigData.custodians.length);
    $("#isCustodian").html(multisigData.isCustodian ? 'Yes' : 'No');
    $("#contractName").html(multisigData.contractName);
    if (!multisigData.isCustodian) $("#createNewTransaction").attr('disabled', true);
    if ((multisigData.contractName === 'SetcodeMultisig') || (multisigData.contractName === 'Setcode_Multisig_Wallet_24h')) $("#custodiansPageTrigger").removeClass('disabled');
    await updateTransactionsTable();
    $("#multisigMainForm").removeClass('active');
    $("#multisigTransactionForm").addClass('active');
    $("#transactionsTableContent").removeClass('d-none');
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
        await TON.processMessage(multisigData.address, multisigData.abi, {
            dest: $("#modalAddress").val(),
            value: $("#modalAmount").val() * 1000000000,
            bounce: false,
            allBalance: false,
            payload: ""
        }, 'submitTransaction', multisigData.seed)
        await updateTransactionsTable();
        modules.showHideSpinner('show')
    } catch (err) {
        modules.showHideSpinner('show');
        return modules.alertModal('Error', typeof err === 'object' ? err.message : err);
    }
}

/**
 * Update transactions table
 * @type bool
 * @returns {Promise<void>}
 */
async function updateTransactionsTable(type) {
    await updateData(type, 'transaction');
    $("#transactionsTable > tbody").html("");
    await detectConfirmed('transactions');
    let tableContent = Array.from(multisigData.transactions, (el, iter) => {
        return `<tr>
        <td>${parseInt(iter) + 1}</td>
        <td>${el.dest}</td>
        <td>${(parseFloat(el.value) / 1000000000).toFixed(3)}</td>
        <td>${el.signsReceived} / ${el.signsRequired}</td>
        <td><a href="#" class="btn btn-secondary btn-sm ${((el.confirmed) || (!multisigData.isCustodian)) ? 'disabled' : ''}" onclick='confirmTransaction(${JSON.stringify(el)}, "transaction")'>Confirm</a></td>
        </tr>`
    }).join('')
    $('#transactionsTable > tbody').append(tableContent);
    if (type) modules.showHideSpinner('show');
}

/**
 * Show custodians page
 * @returns {Promise<void>}
 */
async function drawCustodiansPage() {
    modules.showHideSpinner('hide');
    $("#multisigTransactionForm").removeClass('active');
    $("#transactionsTableContent").addClass('d-none');
    $("#multisigCustodiansForm").addClass('active');
    $("#ownersTableContent").removeClass('d-none');
    $("#ownerAddress").html(multisigData.address)
    $("#ownersList ol").empty();
    multisigData.custodians.forEach((el, i) => ($("#ownersList ol").append(`<li>${i + 1}. ${el.pubkey}</li>`)))
    await updateOwnersModalData();
    await updateOwnersRequests();
    modules.showHideSpinner('show');
}

/**
 * Owners modal
 * @param pubKeysCount
 * @returns {Promise<void>}
 */
async function updateOwnersModalData(pubKeysCount = 1) {
    $("#modalPubKeys").empty();
    multisigData.custodians.forEach(el => {
        $("#modalPubKeys").append(
            `<div class="input-group input-group-sm mb-1" id="modalpubkey${pubKeysCount + 1}" style="margin-bottom: 0 !important;"><div class="input-group-prepend"><span class="input-group-text">Pub key</span></div>
              <input type="text" id="pubkey${pubKeysCount + 1}" class="form-control" value="${el.pubkey}"/>
              <a href="#" class="href-grey" onclick="removeModalPubKey(${pubKeysCount + 1})">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"/></svg>
              </a>
         </div>`);
        pubKeysCount++;
    })
}

/**
 * Add new pub key input at modal form
 * @returns {Promise<void>}
 */
async function addNewPubKey() {
    let pubKeysCount = parseInt($("div[id^='modalpubkey']").sort((a, b) => {
        return (parseInt((b.id.split('modalpubkey'))[1]) - parseInt((a.id.split('modalpubkey'))[1]))
    })[0].id.split('modalpubkey')[1]) || 1;
    $("#modalPubKeys").append(
        `<div class="input-group input-group-sm mb-1" id="modalpubkey${pubKeysCount + 1}" style="margin-bottom: 0 !important;"><div class="input-group-prepend"><span class="input-group-text">Pub key</span></div>
              <input type="text" id="pubkey${pubKeysCount + 1}" class="form-control"/>
              <a href="#" class="href-grey" onclick="removeModalPubKey(${pubKeysCount + 1})">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"/></svg>
              </a>
         </div>`);
}

/**
 * Remove modal pub key
 * @param id
 * @returns {Promise<void>}
 */
async function removeModalPubKey(id) {
    $(`#modalpubkey${id}`).remove();
}

/**
 * Update ownersRequests table
 * @param type
 * @returns {Promise<void>}
 */
async function updateOwnersRequests(type) {
    await updateData(type, 'request');
    $("#ownersTable > tbody").html("");
    await detectConfirmed('ownersRequests');
    let tableContent = Array.from(multisigData.ownersRequests, (el, iter) => {
        return `<tr>
        <td>${iter + 1}</td>
        <td>${el.creator}</td>
        <td>${el.signs}</td>
        <td>
        <a href="#" class="btn btn-secondary btn-sm" onclick='ownersRequestsInfo(${JSON.stringify(el)})'>Info</a>
        <a href="#" class="btn btn-secondary btn-sm ${((el.confirmed) || (!multisigData.isCustodian)) ? 'disabled' : ''}" onclick='confirmTransaction(${JSON.stringify(el)}, "request")'>Confirm</a>
        <a href="#" class="btn btn-secondary btn-sm ${(!multisigData.isCustodian) ? 'disabled' : ''}" onclick='deployOrderRequest(${JSON.stringify(el)})'>Deploy</a>
        </td>
        </tr>`
    }).join('')
    $('#ownersTable > tbody').append(tableContent);
    if (type) modules.showHideSpinner('show');
}

/**
 * Show new custodians info
 * @param el
 * @param row
 * @returns {Promise<void>}
 */
async function ownersRequestsInfo(el, row = '') {
    $("#ownersRequestModal").html(el.custodians.join(', '));
    $("#reqConfirmsRequestModal").html(el.reqConfirms);
    $("#requestModal").modal('show');
}

/**
 * Deploy order request
 * @param el
 * @returns {Promise<void>}
 */
async function deployOrderRequest(el) {
    try {
        modules.showHideSpinner('hide');
        await TON.processMessage(multisigData.address, multisigData.abi, {updateId: el.id, code: multisigData.code}, 'executeUpdate', multisigData.seed);
        await updateOwnersRequests();
        multisigData.custodians = await TON.callRunTvm(multisigData.abi, multisigData.address, multisigData.boc, 'getCustodians', 'custodians');
        $("#ownersList ol").empty();
        multisigData.custodians.forEach(el => ($("#ownersList ol").append(`<li>${el.pubkey}</li>`)))
        modules.showHideSpinner('show');
    } catch (err) {
        modules.showHideSpinner('show');
        return modules.alertModal('Error', typeof err === 'object' ? err.message : err);
    }
}

/**
 * Create new update owners
 * @returns {Promise<void>}
 */
async function createNewUpdateOwners() {
    modules.showHideSpinner('hide');
    try {
        $("#ownersModal").modal('hide');
        await TON.processMessage(multisigData.address, multisigData.abi, {
            codeHash: `0x${multisigData.code_hash}`,
            owners: Array.from($("input[id^='pubkey']"), el => ($(`#${el.id}`).val())),
            reqConfirms: $("#modalReqConfirms").val()
        }, 'submitUpdate', multisigData.seed)
        await updateOwnersRequests();
        modules.showHideSpinner('show');
    } catch (err) {
        modules.showHideSpinner('show');
        return modules.alertModal('Error', typeof err === 'object' ? err.message : err);
    }
}

/**
 * Confirm transaction / update request
 * @param el
 * @param type
 * @returns {Promise<void>}
 */
async function confirmTransaction(el, type) {
    try {
        modules.showHideSpinner('hide');
        let input = (type === 'transaction') ? {transactionId: el.id} : {updateId: el.id}
        await TON.processMessage(multisigData.address, multisigData.abi, input, type === 'transaction' ? 'confirmTransaction' :'confirmUpdate', multisigData.seed);
        (type === 'transaction') ? await updateTransactionsTable() : await updateOwnersRequests();
        modules.showHideSpinner('show');
        if ((type === 'transactions') && (parseInt(el.signsReceived) + 1 === parseInt(el.signsRequired))) modules.alertModal('Success', 'Transaction send successfully');
    } catch (err) {
        modules.showHideSpinner('show');
        return modules.alertModal('Error', typeof err === 'object' ? err.message : err);
    }
}

/**
 * Detect confirmed or not transactions / change owners
 * @param type
 * @returns {Promise<boolean>}
 */
async function detectConfirmed(type) {
    let custodianIndex = multisigData.custodians.filter(el => (el.pubkey === `0x${multisigData.pubkey}`));
    for (let tr of multisigData[type]) {
        if (custodianIndex[0] === undefined) return tr.confirmed = false;
        let isConfirmedMessage = await TON.encodeGetMessage(multisigData.abi, multisigData.address, 'isConfirmed', {
            mask: tr.confirmationsMask,
            index: custodianIndex[0].index
        });
        tr.confirmed = (await TON.runTvm(multisigData.abi, multisigData.boc, isConfirmedMessage.message)).confirmed;
    }
}

/**
 * Update request / transactions data
 * @param spinnerType
 * @param type
 * @returns {Promise<void>}
 */
async function updateData(spinnerType, type) {
    if (spinnerType) modules.showHideSpinner('hide');
    let accData = await TON.getAccountData(multisigData.address);
    multisigData.boc = accData.parsed.boc;
    if (type === 'request') {
        multisigData.ownersRequests = await TON.callRunTvm(multisigData.abi, multisigData.address, multisigData.boc, 'getUpdateRequests', 'updates');
    } else {
        multisigData.balance = parseFloat(converter.hexToDec(accData.parsed.balance) / 1000000000);
        multisigData.transactions = await TON.callRunTvm(multisigData.abi, multisigData.address, multisigData.boc, 'getTransactions', 'transactions');
        $("#balance").html(multisigData.balance);
    }
}

module.exports = {
    createNewMultisignTransaction, updateTransactionsTable, connectToMultisig,
    drawCustodiansPage, addNewPubKey, removeModalPubKey, createNewUpdateOwners,
    deployOrderRequest, ownersRequestsInfo, updateOwnersRequests, drawTransactionsPage,
    confirmTransaction
}