`use strict`;

let modules = require('../modules/modules');
let en = require('../consts/en_words');
let separators = /[\s,]+/;
let minSymbols = 3;

/**
 * Change seed input type & icon
 */
$('.eye-password').on('click', function() {
    $(this).toggleClass('fa-eye-slash fa-eye');
    $(`#seed`).attr('type', ($(`#seed`).attr('type') === 'password') ? 'text' : 'password')
});

/**
 * Draw abi from local input to textarea
 */
$('#abiFile').change(async _ => {
    let txt = await modules.getAbi();
    $('#abiText').val(txt);
})

/**
 * Seed phrase keyup
 */
$('#seed').keyup((el, row = '') => {
    $("#seedList").empty();
    let words = el.currentTarget.value.split(separators)
    let lastValue = words[words.length - 1];
    if (lastValue.length < minSymbols) return;
    let appendWords = en.filter(el => (el.includes(lastValue, 0)))
    if ((appendWords.length === 1) && (lastValue === appendWords[0])) return;
    words.pop();
    appendWords.forEach(el => {
        row += `<option>${words.join(' ')} ${el}</option>`
    })
    $("#seedList").append(row);
})