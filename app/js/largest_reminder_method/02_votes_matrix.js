'use strict';

var base = require('./00_base.js');

function calculateRegionMandatesCount() {
    var mandatesRemaining = data["TOTAL_MANDATES"], regions = [];
    var regionVotes = base.getRegionVotes();
    _.each(data["regionQuotes"], function (regionQuote, regionId) {
        var quotient = parseFloat(regionVotes[regionId]) / regionQuote;
        var baseMandates = Math.floor(quotient);
        var reminder = quotient - baseMandates;
        regions.push({
            id: regionId,
            quotient: quotient,
            reminder: reminder,
            baseMandates: baseMandates,
            // this will be updated later
            extraMandates: 0,
            totalMandates: baseMandates
        });
        mandatesRemaining -= baseMandates;
    });

    var sortedByReminderDesc = _.sortBy(regions, 'reminder').reverse();
    for (var i = 0; i < sortedByReminderDesc.length && mandatesRemaining > 0; i++) {
        sortedByReminderDesc[i].extraMandates++;
        sortedByReminderDesc[i].totalMandates++;
        mandatesRemaining--;
    }

    return _.object(_.map(sortedByReminderDesc, function (region) {
        return [region.id, region.totalMandates];
    }));
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

    table.append(function () {
        var row = $('<tr/>');
        _.each(data.regions, function (region) {
            row.append(base.cell(region));
        });
        return row;
    });

    table.append(_.map(_.keys(data["parties"]), function (partyId) {
        var partyName = data.parties[partyId];
        var row = base.row(partyName);
        _.each(_.keys(data.regions), function (regionId) {
            row.append(base.cell(data.partyRegionVotes[partyId][regionId]));
        });
        row.append(base.cell(base.getPartyVotesSum(partyId)));
        return row;
    }));

    table.append(function () {
        var row = base.row('Общо за района');
        var regionVotes = base.getRegionVotes();
        _.each(regionVotes, function (votes) {
            row.append(base.cell(votes));
        });
        row.append(base.cell(_.sum(regionVotes)));
        return row;
    });

    table.append(function () {
        var row = base.row('Мандати за района');
        var regionMandates = calculateRegionMandatesCount();
        _.each(data['regions'], function (regionName, regionId) {
            row.append(base.cell(regionMandates[regionId]));
        });
        return row;
    });


    return table;
}

module.exports = {
    createTable: createTable
};