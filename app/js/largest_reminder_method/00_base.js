'use strict';

function getPartyRegionVotesSum() {
    return _.sum(_.map(data.partyRegionVotes, function (partyRegion) {
        return _.sum(partyRegion);
    }));
}

function getIndependentVotesSum() {
    return _.sum(data.independentCandidates);
}

function getRealVotesSum() {
    return getPartyRegionVotesSum() + getIndependentVotesSum();
}

function getMinimumVotesToGetElected() {
    return 0.04 * getRealVotesSum();
}

function getHareQuote(votes, seats) {
    return votes / seats;
}

var electedParties = null;
function getElectedParties() {
    if (electedParties === null) {
        electedParties = {};
        _.each(data.parties, function (partyName, partyId) {
            var partyVotes = getPartyVotesSum(partyId);
            if (partyVotes > getMinimumVotesToGetElected()) {
                electedParties[partyId] = partyVotes;
            }
        });
    }
    return electedParties;
}

var electedPartiesVotesSum = null;
function getElectedPartiesVotesSum() {
    if (electedPartiesVotesSum === null) {
        electedPartiesVotesSum = _.sum(getElectedParties());
    }
    return electedPartiesVotesSum;
}

var regionVotes = null;
function getRegionVotes() {
    if (regionVotes === null) {
        regionVotes = {};
        _.each(data.parties, function (partyName, partyId) {
            _.each(data.regions, function (regionName, regionId) {
                if (!regionVotes.hasOwnProperty(regionId)) {
                    regionVotes[regionId] = 0;
                }
                regionVotes[regionId] += data.partyRegionVotes[partyId][regionId];
            });
        });
    }
    return regionVotes;
}

function getPartyVotesSum(partyId) {
    return _.sum(data.partyRegionVotes[partyId]);
}

function cell(value) {
    return $('<td>' + value + '</td>');
}

function row(firstCell) {
    return $('<tr />').append(cell(firstCell));
}

var regionMandates = {
    "1": 11,
    "2": 14,
    "3": 15,
    "4": 8,
    "5": 4,
    "6": 6,
    "7": 4,
    "8": 6,
    "9": 5,
    "10": 4,
    "11": 5,
    "12": 5,
    "13": 9,
    "14": 4,
    "15": 9,
    "16": 11,
    "17": 11,
    "18": 4,
    "19": 8,
    "20": 4,
    "21": 6,
    "22": 4,
    "23": 16,
    "24": 12,
    "25": 14,
    "26": 8,
    "27": 11,
    "28": 4,
    "29": 8,
    "30": 6,
    "31": 4,
    "32": 0
};

module.exports = {
    regionMandates: regionMandates,
    getElectedParties: getElectedParties,
    getElectedPartiesVotesSum: getElectedPartiesVotesSum,
    getHareQuote: getHareQuote,
    getMinimumVotesToGetElected: getMinimumVotesToGetElected,
    getPartyVotesSum: getPartyVotesSum,
    getRealVotesSum: getRealVotesSum,
    getRegionVotes: getRegionVotes,
    cell: cell,
    row: row
};