'use strict';

var core = require('./core.js');
var helpers = require('./helpers.js');
var data = core.getData();

function buildRegionQuotesSection() {
    var wrapper = $('<div class="region-quotes-section" />');
    helpers.appendSectionTitle(wrapper, "Районни избирателни квоти:");

    var table = $('<table id="region-quotes-table" class="" />');

    $(table).append('<td class="header" align="center" colspan="' + _.size(data["regionQuotes"]) + '">Квоти по райони</td>');

    var regionsIdRow = $('<tr/>'),
        regionsQuoteRow = $('<tr/>');

    _.each(core.getRegionQuotes(), function (regionQuote, regionId) {
        $(regionsIdRow).append($('<td>' + regionId + '</td>'));
        $(regionsQuoteRow).append($('<td>' + regionQuote + '</td>'));
    });

    $(regionsIdRow).appendTo(table);
    $(regionsQuoteRow).appendTo(table);
    wrapper.append(table);

    return wrapper;
}

function buildPartyXRegionVotesSection() {
    var wrapper = $('<div class="region-votes-section" />');
    helpers.appendSectionTitle(wrapper, 'Действителни гласове за партии и коалиции от партии по райони:');

    var table = $(
        '<table id="votes-matrix">' +
        '<tr class="header" align="center">' +
        '<td rowspan="2">Партии</td>' +
        '<td colspan="' + _.size(data['regions']) + '">Райони</td>' +
        '<td rowspan="2">Общо</td>' +
        '</tr>' +
        '</table>'
    );

    table.append(function () {
        var row = $('<tr class="header" />');
        _.each(core.getRegions(), function (region) {
            row.append(helpers.cell(region));
        });
        return row;
    });

    table.append(_.map(core.getParties(), function (partyName, partyId) {
        var row = helpers.row(partyName);
        _.each(_.keys(core.getRegions()), function (regionId) {
            row.append(helpers.cell(core.getPartyRegionVotes(partyId, regionId)));
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

    wrapper.append(table);

    return wrapper;
}

module.exports = {
    buildRegionQuotesSection: buildRegionQuotesSection,
    buildPartyXRegionVotesSection: buildPartyXRegionVotesSection
};