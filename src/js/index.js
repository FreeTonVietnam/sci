`use strict`;

let multisig = require('./pages/multisig');
let sci = require('./pages/sci');

require('./listeners/listeners');

$('#abiClickEl').click(function() {
    $('#abiFile').click();
});

function updateCollapse(name) {
    if ($(`#collapse_${name}.active`).length) {
        $(`#collapse_${name}`).removeClass('active')
    } else {
        $(`#collapse_${name}`).addClass('active')
    }
}

// SCI
window.connectToAbi = sci.connectToAbi;
window.callABIFunction = sci.callABIFunction;

// MULTISIG
window.connectToMultisig = multisig.connectToMultisig;
window.createNewMultisignTransaction = multisig.createNewMultisignTransaction;
window.updateTransactionsTable = multisig.updateTransactionsTable;
window.confirmTransaction = multisig.confirmTransaction;
window.drawCustodiansPage = multisig.drawCustodiansPage;
window.addNewPubKey = multisig.addNewPubKey;
window.removeModalPubKey = multisig.removeModalPubKey;
window.createNewUpdateOwners = multisig.createNewUpdateOwners;
window.deployOrderRequest = multisig.deployOrderRequest;
window.ownersRequestsInfo = multisig.ownersRequestsInfo;
window.updateOwnersRequests = multisig.updateOwnersRequests;
window.drawTransactionsPage = multisig.drawTransactionsPage;
window.generateRandomKeys = multisig.generateRandomKeys;
window.deployMultisigSecondPage = multisig.deployMultisigSecondPage;
window.deployNewAddress = multisig.deployNewAddress;

window.updateCollapse = updateCollapse;