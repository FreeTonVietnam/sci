`use strict`;

let multisig = require('./pages/multisig');
let sci = require('./pages/sci');

require('./listeners/listeners');

// SCI
window.connectToAbi = sci.connectToAbi;
window.callABIFunction = sci.callABIFunction;

// MULTISIG
window.connectToMultisig = multisig.connectToMultisig;
window.createNewMultisignTransaction = multisig.createNewMultisignTransaction;
window.updateTransactionsTable = multisig.updateTransactionsTable;
window.confirmTransaction = multisig.confirmTransaction;