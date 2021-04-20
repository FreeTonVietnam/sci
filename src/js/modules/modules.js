'use strict';

let bigInt = require("big-integer");

module.exports = {

    /**
     * Get ABI from textarea or input file
     * @param _
     * @returns {Promise<any>}
     */
    getAbi: async _ => {
        if ($('#abiText').val() !== '') return $('#abiText').val();
        let fileReader = new FileReader();
        fileReader.readAsText($('#abiFile').prop('files')[0]);
        return new Promise(resolve => {
            fileReader.onload = (_ => (resolve(fileReader.result)))
        })
    },

    /**
     * Prepare row for draw abi function / inputs
     * @param abiFunction
     * @param row
     * @returns {*}
     */
    prepareRowForDrawAbi: (abiFunction, row) => {
        let startClass = (Object.keys(abiFunction.inputs).length) ? `<div class="info-section info-section--collapse" id="collapse_${abiFunction.name}">` : `<div class="info-section info-section--call">`
        row += `${startClass}<div class="info-head" onclick='updateCollapse("${abiFunction.name}")'><div class="info-ttl">${abiFunction.name}</div>`
        if (Object.keys(abiFunction.inputs).length) {
            row += `</div><div class="info-body">`;
            for (let val of Object.values(abiFunction.inputs)) {
                row += `<div class="ui-form-field"><label class="ui-input"><span class="ui-input-inner">`;
                row += `<span class="ui-input-text">${val.name} (${val.type})</span>`
                row += `<input type="text" name="${abiFunction.name}_${val.name}"/>`;
                row += `</span></label></div>`
            }
            row += `<button class="info-call-btn float-right" onclick='callABIFunction("${abiFunction.name}")'>Call</button><br/>`
        } else {
            row += `<div class="info-call">`
            row += `<button class="info-call-btn" onclick='callABIFunction("${abiFunction.name}")'>Call</button></div>`
        }
        row += `</div></div>`
        return row;
    },

    /**
     * Get input params of currenct abi function
     * @param functionName
     * @param data
     * @returns {{}}
     */
    getABIFunctionParams: (functionName, data = {}) => {
        for (let [key, val] of Object.entries($(`input[name^="${functionName}_"]`))) {
            if ((key === 'length') || (key === 'prevObject')) continue;
            data[(val.name).split('_')[1]] = (val.value === 'true') ? true : (val.value === 'false') ? false :
                ((!isNaN(Number(val.value))) && (val.value.trim() !== '')) ? ((Number.MAX_SAFE_INTEGER > parseFloat(val.value)) ? parseFloat(val.value) : bigInt(val.value)) : val.value;
        }
        return data;
    },

    /**
     * Show or hide spinner
     * @param type
     */
    showHideSpinner: (type) => {
        (type === 'hide') ? $.blockUI({message: null, overlayCSS: {cursor: "default", opacity: 0.0}}) : $.unblockUI();
        (type === 'hide') ? $('#spinner').removeClass('d-none') : $('#spinner').addClass('d-none');
        $('.page').css('opacity', (type === 'show') ? 1 : 0.4);
    },

    /**
     * Show alert modal
     * @param type
     * @param msg
     */
    alertModal: (type, msg) => {
        $('#alertModalTitle').html(type);
        $('#alertModalBody').html(msg);
        $('#alertModal').modal('toggle');
    }
}