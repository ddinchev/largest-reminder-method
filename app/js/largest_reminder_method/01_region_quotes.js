'use strict';

var base = require('./00_base.js');

function createTable(d) {
    var table = $('<table id="region-quotes-table" class="" />');

    $(table).append('<td align="center" colspan="' + _.size(data.regionQuotes) + '">Квоти по райони</td>');

    var regionsIdRow = $('<tr/>'),
        regionsQuoteRow = $('<tr/>');

    _.each(data.regionQuotes, function (regionQuote, regionId) {
        $(regionsIdRow).append($('<td>' + regionId + '</td>'));
        $(regionsQuoteRow).append($('<td>' + regionQuote + '</td>'));
    });

    $(regionsIdRow).appendTo(table);
    $(regionsQuoteRow).appendTo(table);
    return table;
}

module.exports = {
    createTable: createTable
};