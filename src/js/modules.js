'use strict';

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
        row += `<li><a data-toggle="collapse" href="#${abiFunction.name}_accordion" class="collapsed"</a>${abiFunction.name}`
        row += `<p class="pull-right">`
        row += (Object.keys(abiFunction.inputs).length) ? `<i class="fa fa-chevron-down icon-show"></i><i class="fa fa-chevron-up icon-close"></i>` :
            `<button class="button-call-abi btn btn-sm btn-secondary" style="margin-left:0 !important; margin-top: -10px;" onclick='callABIFunction("${abiFunction.name}")'>Call</button>`
        row += `</p></a>`
        if (Object.keys(abiFunction.inputs).length) {
            row += `<div id="${abiFunction.name}_accordion" class="collapse abi-func-content" data-parent=".accordion-list"><br/>`
            for (let val of Object.values(abiFunction.inputs)) {
                row += `<div class="input-group input-group-sm mb-3"><div class="input-group-prepend"><span class="input-group-text">${val.name} (${val.type})</span></div>`
                row += `<input type="text" name="${abiFunction.name}_${val.name}" class="form-control"/></div>`
            }
            row += `<button class="button-call-abi btn btn-sm btn-secondary" onclick='callABIFunction("${abiFunction.name}")'>Call</button></div>`
        }
        row += `</li>`
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
                ((!isNaN(Number(val.value))) && (val.value.trim() !== '')) ? parseFloat(val.value) : val.value;
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
        $('#container').css('opacity', (type === 'show') ? 1 : 0.3);
    }
}