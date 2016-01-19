'use strict';

var base = require('./00_base.js');


function getRegionsHeaderRow() {
    var row = $('<tr/>');
    _.each(data.regions, function (region) {
        row.append(base.cell(region));
    });
    return row;
}

function getPartyVotesRow(partyId) {
    var partyName = data.parties[partyId];
    var row = base.row(partyName);
    _.each(_.keys(data.regions), function (regionId) {
        row.append(base.cell(data.partyRegionVotes[partyId][regionId]));
    });
    row.append(base.cell(base.getPartyVotesSum(partyId)));
    return row;
}

function createTable() {
    var table = $(
        '<table id="votes-matrix">' +
        '<tr align="center">' +
        '<td rowspan="2">Партии</td>' +
        '<td colspan="' + _.size(data.regions) + '">Райони</td>' +
        '<td rowspan="2">Общо</td>' +
        '</tr>' +
        '</table>'
    );

    $(table).append(getRegionsHeaderRow());

    _.each(_.keys(data.parties), function (partyId) {
        table.append(getPartyVotesRow(partyId));
    });


    var regionVotes = base.getRegionVotes();

    table.append(function () {
        var row = $('<tr><td>Общо за района</td></tr>');
        _.each(regionVotes, function (votes) {
            row.append(base.cell(votes));
        });
        row.append(base.cell(_.sum(regionVotes)));
        return row;
    });


    var regionMandates = {};
//    _.each(r)


    return table;
}

module.exports = {
    createTable: createTable
};