'use strict';

var core = require('./core.js');
var helpers = require('./helpers.js');
var data = core.getData();

function buildRegionQuotesMatrix(d) {
    var table = $('<table id="region-quotes-table" class="" />');

    $(table).append('<td align="center" colspan="' + _.size(data["regionQuotes"]) + '">Квоти по райони</td>');

    var regionsIdRow = $('<tr/>'),
        regionsQuoteRow = $('<tr/>');

    _.each(core.getRegionQuotes(), function (regionQuote, regionId) {
        $(regionsIdRow).append($('<td>' + regionId + '</td>'));
        $(regionsQuoteRow).append($('<td>' + regionQuote + '</td>'));
    });

    $(regionsIdRow).appendTo(table);
    $(regionsQuoteRow).appendTo(table);
    return table;
}

function buildPartyXRegionVotesMatrix() {
    var table = $(
        '<table id="votes-matrix">' +
        '<tr align="center">' +
        '<td rowspan="2">Партии</td>' +
        '<td colspan="' + _.size(data['regions']) + '">Райони</td>' +
        '<td rowspan="2">Общо</td>' +
        '</tr>' +
        '</table>'
    );

    table.append(function () {
        var row = $('<tr/>');
        _.each(data.regions, function (region) {
            row.append(helpers.cell(region));
        });
        return row;
    });

    table.append(_.map(_.keys(data['parties']), function (partyId) {
        var partyName = data['parties'][partyId];
        var row = helpers.row(partyName);
        _.each(_.keys(data['regions']), function (regionId) {
            row.append(helpers.cell(data.partyRegionVotes[partyId][regionId]));
        });
        row.append(helpers.cell(core.getPartyVotesSum(partyId)));
        return row;
    }));

    table.append(function () {
        var row = helpers.row('Общо за района');
        var regionVotes = core.getRegionVotes();
        _.each(regionVotes, function (votes) {
            row.append(helpers.cell(votes));
        });
        row.append(helpers.cell(_.sum(regionVotes)));
        return row;
    });

    table.append(function () {
        var row = helpers.row('Мандати за района');
        var regionMandates = core.getRegionMandates();
        _.each(core.getRegions(), function (regionName, regionId) {
            row.append(regionMandates.hasOwnProperty(regionId) ? helpers.cell(regionMandates[regionId]) : helpers.emptyCell())
        });
        row.append(helpers.cell(_.sum(regionMandates)));
        return row;
    });

    return table;
}

module.exports = {
    buildRegionQuotesMatrix: buildRegionQuotesMatrix,
    buildPartyXRegionVotesMatrix: buildPartyXRegionVotesMatrix
};