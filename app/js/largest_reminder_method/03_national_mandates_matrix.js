'use strict';

var data = require(__dirname + '/../../data/parliament-elections-2014-bulgaria.json');
var base = require(__dirname + '/00_base.js');

function calculateElectedPartiesDistribution() {
    var totalMandates = data["TOTAL_MANDATES"];
    var electedPartiesVotes = base.getElectedPartiesVotesSum();
    var hareQuote = base.getHareQuote(electedPartiesVotes, totalMandates);
    var electedParties = base.getElectedParties();

    var mandatesRemaining = totalMandates;
    var electedPartyDistributions = [];
    _.each(electedParties, function (partyName, partyId) {
        var quotient = electedParties[partyId] / hareQuote;
        var baseMandates = Math.floor(quotient);
        var reminder = quotient - baseMandates;
        mandatesRemaining -= baseMandates;
        electedPartyDistributions.push({
            id: partyId,
            quotient: quotient,
            baseMandates: baseMandates,
            reminder: reminder,
            // this will be updated later
            extraMandates: 0,
            totalMandates: baseMandates
        });
    });

    var descByRemainders = _.sortBy(electedPartyDistributions, 'reminder').reverse();
    for (var i = 0; i < descByRemainders.length && mandatesRemaining > 0; i++) {
        descByRemainders[i].extraMandates++;
        descByRemainders[i].totalMandates++;
        mandatesRemaining--;
    }

    return _.object(_.map(descByRemainders, function (party) {
        return [party.id, party];
    }));
}

/*
example data
 [{
     id: 1,
     quotient: 123.32,
     baseMandates: 13,
     reminder: 0.987,
     extraMandates: 1,
     totalMandates: 25
 }, ...]
*/
var electedPartyDistributions = calculateElectedPartiesDistribution();

function buildNationalPartyMandatesMatrix() {
    var table = $('<table class="national-level-party-mandates" />');
    table.append(function () {
        var headerRow = base.row('Партия');
        var realVotesRow = base.row('Действ. гласове');
        var quotientRow = base.row('Частно');
        var baseMandatesRow = base.row('Осн. манд.');
        var remindersRow = base.row('Остатък');
        var extraMandatesRow = base.row('Доп. манд.');
        var totalMandatesRow = base.row('Общо манд.');
        _.each(data.parties, function (partyName, partyId) {
            headerRow.append(base.cell(partyName));
            realVotesRow.append(base.cell(base.getPartyVotesSum(partyId)));

            if (!electedPartyDistributions.hasOwnProperty(partyId)) {
                _.each([quotientRow, baseMandatesRow, remindersRow, extraMandatesRow, totalMandatesRow], function (row) {
                   row.append(base.emptyCell());
                });
            } else {
                var partyDistribution = electedPartyDistributions[partyId];
                quotientRow.append(base.cell(partyDistribution.quotient.toFixed(6)));
                baseMandatesRow.append(base.cell(partyDistribution.baseMandates));
                remindersRow.append(base.cell(partyDistribution.reminder.toFixed(6)));
                extraMandatesRow.append(base.cell(partyDistribution.extraMandates));
                totalMandatesRow.append(base.cell(partyDistribution.totalMandates));
            }
        });

        return [headerRow, realVotesRow, quotientRow, baseMandatesRow, remindersRow, extraMandatesRow, totalMandatesRow];
    });

    return table;
}




function buildRegionElectedPartyMandatesSection(regionId) {
    // var table = $('<table class="region-party-mandates" />');

}

module.exports = {
    buildNationalPartyMandatesMatrix: buildNationalPartyMandatesMatrix,
    buildRegionElectedPartyMandatesSection: buildRegionElectedPartyMandatesSection
};
