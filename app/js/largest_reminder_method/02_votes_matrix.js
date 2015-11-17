'use strict';

var base = require('./00_base.js');

function getTable() {
    var table = $(
        '<table id="votes-matrix">' +
        '<tr align="center">' +
        '<td rowspan="2">Партии</td>' +
        '<td colspan="' + _.size(data.regions) + '">Райони</td>' +
        '<td rowspan="2">Общо</td>' +
        '</tr>' +
        '</table>'
    );

    $(table).append(function () {
        var row = $('<tr/>');
        _.each(data.regions, function (region) {
            $(row).append('<td>' + region + '</td>');
        });
        return row;
    });

    _.each(data.parties, function (partyName, partyIndex) {
        table.append(function () {
            var row = base.row(partyIndex + '. ' + partyName);
            _.each(data.regions, function (regionName, regionIndex) {
                row.append('<td>' + data.partyRegionVotes[partyIndex][regionIndex] + '</td>');
            });
            $('<td>' + base.getPartyVotesSum(partyIndex) + '</td>').appendTo(row);
            return row;
        });
    });

    table.append(function () {
        var row = $('<tr><td>Общо за района</td></tr>');
        var total = 0;
        _.each(data.regions, function (regionName, regionKey) {
            var sum = 0;
            _.each(data.partyRegionVotes, function (partyRegion) {
                sum += partyRegion[regionKey];
            });
            total += sum;
            row.append(base.cell(sum));
        });
        row.append('<td>' + total + '</td>');
        return row;
    });

    return table;
}

module.exports = {
    getTable: getTable
};