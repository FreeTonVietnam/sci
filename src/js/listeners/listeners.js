`use strict`;

let modules = require('../modules/modules');
let en = require('../consts/en_words');
let separators = /[\—]+/;
let minSymbols = 3;

/**
 * Change seed input type & icon
 */
$('.eye-password').on('click', function () {
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
    $('#seed').val($("#seed").val().replace(/[\s\,\-]/g, '—'))
    let words = el.currentTarget.value.split(separators);
    if (el.originalEvent.key === ' ') autoFillIfSpace(words);
    $("#seedList").empty();
    let lastValue = words[words.length - 1];
    if (lastValue.length < minSymbols) return;
    let appendWords = en.filter(el => (el.startsWith(lastValue)))
    if ((appendWords.length === 1) && (lastValue === appendWords[0])) return;
    words.pop();
    let joinWords = words.length ? words.join('—') + '—' : '';
    appendWords.forEach(el => {
        row += `<option>${joinWords}${el}</option>`
    })
    $("#seedList").append(row);
})

/**
 * Auto fill after space, if word was found
 * @param words
 */
function autoFillIfSpace(words) {
    let lastValue = words[words.length - 2];
    let datalist = Array.from($("#seedList option"), el => ($(el).text()));
    let res = datalist.find(el => (el === lastValue));
    if (res || (!datalist.length)) return;
    let datalistWords = datalist[0].split('—')
    words[words.length - 2] = datalistWords[datalistWords.length - 1]
    $('#seed').val(words.join('—'));
}
