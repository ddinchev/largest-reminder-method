'use strict';

var core = require(__dirname + '/core.js');
var helpers = require(__dirname + '/helpers.js');

function buildRegionalDistributionSections() {
    var wrapper = $('<div class="regional-distribution-sections" />');
    helpers.appendSectionTitle(wrapper, 'Втора стъпка – разпределение на спечелените мандати за всяка партия или коалиция в многомандатните избирателни райони:');

    _.each(_.keys(core.getRegionMandates()), function (regionId) {
        var regionData = core.getRegionPartyDistribution(regionId);

        helpers.appendInfoMessage(wrapper, 'Разпределение на мандатите в МИР ' + regionData.name.toUpperCase());
        helpers.appendInfoMessage(wrapper, 'Действителни гласове за партии и коалиции от партии, участващи в разпределение: ' + regionData.totalVotes);
        helpers.appendInfoMessage(wrapper, 'Брой мандати в МИР: ' + regionData.totalMandates);
        helpers.appendInfoMessage(wrapper, 'Квота на Хеър: ' + regionData.hareQuote);

        var table = $('<table class="region-party-mandates" />');
        table.append(function() {
            var headerRow = helpers.headerRow('Партия');
            var votesRow = helpers.row('Действ. гласове');
            var quotientRow = helpers.row('Частно');
            var baseMandatesRow = helpers.row('Осн. манд.');
            var remindersRow = helpers.row('Остатък');
            var extraMandatesRow = helpers.row('Доп. манд.');
            var totalMandatesRow = helpers.row('Общо манд.');

            _.each(regionData.partyDistributions, function (party) {
                headerRow.append(helpers.cell(party.name));
                votesRow.append(helpers.cell(party.votes));
                baseMandatesRow.append(helpers.cell(party.baseMandates));
                quotientRow.append(helpers.cell(party.quotient.toFixed(10)));
                remindersRow.append(helpers.cell(party.reminder.toFixed(10)));
                extraMandatesRow.append(helpers.cell(party.extraMandates));
                totalMandatesRow.append(helpers.cell(party.totalMandates));
            });

            return [headerRow, votesRow, quotientRow, baseMandatesRow, remindersRow, extraMandatesRow, totalMandatesRow];
        });

        wrapper.append(table);
    });

    return wrapper;
}

module.exports = {
    buildRegionalDistributionSections: buildRegionalDistributionSections
};