'use strict';

var data = require(__dirname + '/../../data/parliament-elections-2014-bulgaria.json');
var base = require(__dirname + '/00_base.js');

var partyBaseMandates = null;
var partyMandates = null;

function getNationalPartyMandatesMatrix() {
    var table = $('<table class="national-level-party-mandates" />');
    var headerRow = base.row('Партия');
    _.each(data.parties, function (partyName, partyId) {
        headerRow.append(base.cell(partyName));
    });
    table.append(headerRow);

    var realVotesRow = base.row('Действ. гласове');
    _.each(data.parties, function (partyName, partyId) {
        realVotesRow.append(base.cell(base.getPartyVotesSum(partyId)));
    });
    table.append(realVotesRow);


    var electedPartiesVotes = base.getElectedPartiesVotesSum();
    var hareQuote = base.getHareQuote(electedPartiesVotes, 240);
    var electedParties = base.getElectedParties();
    table.append(function () {
        // we will fill the total mandates here
        var quotients = {},
            baseMandates = {},
            reminders = {},
            extraMandates = {},
            totalMandates = {};

        _.each(base.parties, function (partyName, partyId) {
            totalMandates[partyId] = null;
        });

        

        var quotientRow = base.row('Частно');
        var baseMandatesRow = base.row('Осн. манд.');
        var remindersRow = base.row('Остатък');
        var extraMandatesRow = base.row('Доп. манд.');
        // var totalMandatesRow = base.row('Общо манд.');
        _.each(data.parties, function (partyName, partyId) {
            if (!electedParties.hasOwnProperty(partyId)) {
                quotientRow.append(base.cell('-'));
                baseMandatesRow.append(base.cell('-'));
                remindersRow.append(base.cell('-'));
            } else {
                var quotient = (electedParties[partyId] / hareQuote).toFixed(6);
                var baseMandates = Math.floor(quotient);
                var reminder = (quotient - baseMandates).toFixed(6);
                quotientRow.append(base.cell(quotient));
                baseMandatesRow.append(base.cell(baseMandates));
                remindersRow.append(base.cell(reminder))
            }
        });
        return [quotientRow, baseMandatesRow, remindersRow, extraMandatesRow];
    });






    return table;
}

module.exports = {
    getNationalPartyMandatesMatrix: getNationalPartyMandatesMatrix
};
