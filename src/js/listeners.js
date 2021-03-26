`use strict`;

let modules = require('./modules');

/**
 * Change seed input type & icon
 */
$('.eye-password').on('click', function() {
    $(this).toggleClass('fa-eye fa-eye-slash');
    $(`#seed`).attr('type', ($(`#seed`).attr('type') === 'password') ? 'text' : 'password')
});

/**
 * Draw abi from local input to textarea
 */
$('#abiFile').change(async _ => {
    let txt = await modules.getAbi();
    $('#abiText').val(txt);
})