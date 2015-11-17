'use strict';

var data = require(__dirname + '/../../data/parliament-elections-2014-bulgaria.json');
var base = require(__dirname + '/00_base.js');

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
    var quotientRow = base.row('Частно');
    _.each(data.parties, function (partyName, partyId) {
        if (!electedParties.hasOwnProperty(partyId)) {
            quotientRow.append(base.cell('-'));
        } else {
            var quotient = (electedParties[partyId] / hareQuote).toFixed(6);
            quotientRow.append(base.cell(quotient));
        }
    });
    table.append(quotientRow);

    return table;
}

module.exports = {
    getNationalPartyMandatesMatrix: getNationalPartyMandatesMatrix
};
