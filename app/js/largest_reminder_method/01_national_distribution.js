'use strict';

var core = require(__dirname + '/core.js');
var helpers = require(__dirname + '/helpers.js');

function buildNationalPartyMandatesSection() {
    var wrapper = $('<div class="natinal-party-matrix-wrapper" />');
    helpers.appendSectionTitle(wrapper, 'Първа стъпка – разпределение на мандатите за всяка партия и коалиция на национално ниво:');

    helpers.appendInfoMessage(wrapper, 'Сума от всички действителни гласове: ' + core.getRealVotesSum());
    helpers.appendInfoMessage(wrapper, 'Четири на сто от действителните гласове в страната и извън страната: ' + core.getMinimumVotesToGetElected());
    helpers.appendInfoMessage(wrapper, 'Сума от действителни гласове за партии и коалиции от партии, които участват в разпределението на мандатите: ' + core.getElectedPartiesVotesSum());
    helpers.appendInfoMessage(wrapper, 'Квота на Хеър: ' + core.getHareQuote(core.getElectedPartiesVotesSum(), 240));

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

    wrapper.append(table);
    return wrapper;
}

module.exports = {
    buildNationalPartyMandatesSection: buildNationalPartyMandatesSection
};
