var PartySeatsAllocator = function () {

};

function cellValue(table, row, col) {
    return $('tr:eq(' + row + ') td:eq(' + col + ')', table).text();
}

$(document).ready(function () {
    $.load('/script/data.js');





});
