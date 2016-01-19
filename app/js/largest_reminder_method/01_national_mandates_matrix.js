'use strict';

var core = require(__dirname + '/core.js');
var helpers = require(__dirname + '/helpers.js');

function buildNationalPartyMandatesMatrix() {
    var electedPartyDistributions = core.getElectedPartiesDistribution();

    var table = $('<table class="national-level-party-mandates" />');
    table.append(function () {
        var headerRow = helpers.row('Партия');
        var realVotesRow = helpers.row('Действ. гласове');
        var quotientRow = helpers.row('Частно');
        var baseMandatesRow = helpers.row('Осн. манд.');
        var remindersRow = helpers.row('Остатък');
        var extraMandatesRow = helpers.row('Доп. манд.');
        var totalMandatesRow = helpers.row('Общо манд.');
        _.each(core.getParties(), function (partyName, partyId) {
            headerRow.append(helpers.cell(partyName));
            realVotesRow.append(helpers.cell(core.getPartyVotesSum(partyId)));

            if (!electedPartyDistributions.hasOwnProperty(partyId)) {
                _.each([quotientRow, baseMandatesRow, remindersRow, extraMandatesRow, totalMandatesRow], function (row) {
                   row.append(helpers.emptyCell());
                });
            } else {
                var partyDistribution = electedPartyDistributions[partyId];
                quotientRow.append(helpers.cell(partyDistribution.quotient.toFixed(6)));
                baseMandatesRow.append(helpers.cell(partyDistribution.baseMandates));
                remindersRow.append(helpers.cell(partyDistribution.reminder.toFixed(6)));
                extraMandatesRow.append(helpers.cell(partyDistribution.extraMandates));
                totalMandatesRow.append(helpers.cell(partyDistribution.totalMandates));
            }
        });

        return [headerRow, realVotesRow, quotientRow, baseMandatesRow, remindersRow, extraMandatesRow, totalMandatesRow];
    });

    return table;
}

module.exports = {
    buildNationalPartyMandatesMatrix: buildNationalPartyMandatesMatrix
};
