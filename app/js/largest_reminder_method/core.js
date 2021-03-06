'use strict';

var data = require(__dirname + '/../../data/parliament-elections-2014-bulgaria.json');
var electedParties = null;
var electedPartiesVotesSum = null;
var electedPartiesDistribution = null;

function resetData() {
    electedParties = null;
    electedPartiesVotesSum = null;
    electedPartiesDistribution = null;
}

function getData() {
    // encapsulate to be able to store/read data
    return data;
}

function getTotalMandates() {
    return data["TOTAL_MANDATES_COUNT"]
}

function setTotalMandates(mandatesCount) {
    data["TOTAL_MANDATES_COUNT"] = parseInt(mandatesCount);
}

function getParties() {
    return getData()["parties"];
}

function getRegions() {
    return getData()["regions"];
}

function getPartyRegionVotes(partyId, regionId) {
    return getData()["partyRegionVotes"][partyId][regionId];
}

function getRealVotesSum() {
    var partyRegionVotesSum = _.sum(_.map(getData()["partyRegionVotes"], function (partyRegion) {
        return _.sum(partyRegion);
    }));
    var independentVotesSum = _.sum(getData()["independentCandidates"]);
    return partyRegionVotesSum + independentVotesSum;
}

function getMinimumVotesToGetElected() {
    return 0.04 * getRealVotesSum();
}

function getHareQuote(votes, seats) {
    return votes / seats;
}

function getElectedParties() {
    if (electedParties === null) {
        electedParties = {};
        _.each(getData()["parties"], function (partyName, partyId) {
            var partyVotes = getPartyVotesSum(partyId);
            if (partyVotes > getMinimumVotesToGetElected()) {
                electedParties[partyId] = partyVotes;
            }
        });
    }
    return electedParties;
}

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
        _.each(getData()["parties"], function (partyName, partyId) {
            _.each(getData()["regions"], function (regionName, regionId) {
                if (!regionVotes.hasOwnProperty(regionId)) {
                    regionVotes[regionId] = 0;
                }
                regionVotes[regionId] += getData()["partyRegionVotes"][partyId][regionId];
            });
        });
    }
    return regionVotes;
}
function getPartyVotesSum(partyId) {
    return _.sum(getData()["partyRegionVotes"][partyId]);
}

function getRegionQuotes() {
    return getData()["regionQuotes"];
}

function getRegionMandates() {
    var mandatesRemaining = getTotalMandates();
    var regionVotes = getRegionVotes();
    var regions = [];
    _.each(getData()["regionQuotes"], function (regionQuote, regionId) {
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

function getElectedPartiesDistribution() {
    if (electedPartiesDistribution == null) {
        var totalMandates = getTotalMandates();
        var electedPartiesVotes = getElectedPartiesVotesSum();
        var hareQuote = getHareQuote(electedPartiesVotes, totalMandates);
        var electedParties = getElectedParties();

        var mandatesRemaining = totalMandates;
        var electedPartyDistributions = [];
        _.each(electedParties, function (partyVotes, partyId) {
            var quotient = electedParties[partyId] / hareQuote;
            var baseMandates = Math.floor(quotient);
            var reminder = quotient - baseMandates;
            mandatesRemaining -= baseMandates;
            electedPartyDistributions.push({
                id: partyId,
                name: getParties()[partyId],
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

        // example data
        // [{ id: 1, name: "Герб", quotient: 123.32, baseMandates: 13,
        // reminder: 0.987, extraMandates: 1, totalMandates: 25 }, ...]
        electedPartiesDistribution = _.object(_.map(descByRemainders, function (party) {
            return [party.id, party];
        }));
    }
    return electedPartiesDistribution;
}

function getRegionPartyDistribution(regionId) {
    var regionName = getRegions()[regionId].toUpperCase();
    var regionVotesSum = _.sum(_.map(getElectedParties(), function (partyVotes, partyId) {
        return getPartyRegionVotes(partyId, regionId);
    }));
    var totalMandates = getRegionMandates()[regionId];
    var hareQuote = getHareQuote(regionVotesSum, totalMandates);
    var electedParties = getElectedParties();

    var mandatesRemaining = totalMandates;
    var regionPartyDistributions = [];
    _.each(electedParties, function (partyVotes, partyId) {
        var regionVotes = getPartyRegionVotes(partyId, regionId);
        var quotient = regionVotes / hareQuote;
        var baseMandates = Math.floor(quotient);
        var reminder = quotient - baseMandates;
        mandatesRemaining -= baseMandates;
        regionPartyDistributions.push({
            id: partyId,
            name: getParties()[partyId],
            votes: regionVotes,
            quotient: quotient,
            baseMandates: baseMandates,
            reminder: reminder,
            // this will be updated later
            extraMandates: 0,
            totalMandates: baseMandates
        });
    });

    var descByRemainders = _.sortBy(regionPartyDistributions, 'reminder').reverse();
    for (var i = 0; i < descByRemainders.length && mandatesRemaining > 0; i++) {
        descByRemainders[i].extraMandates++;
        descByRemainders[i].totalMandates++;
        mandatesRemaining--;
    }

    regionPartyDistributions = _.object(_.map(descByRemainders, function (party) {
        return [party.id, party];
    }));

    return {
        id: regionId,
        name: regionName,
        totalVotes: regionVotesSum,
        totalMandates: totalMandates,
        hareQuote: hareQuote,
        partyDistributions: regionPartyDistributions
    };
}

module.exports = {
    getData: getData,
    resetData: resetData,
    getParties: getParties,
    getRegions: getRegions,
    getPartyRegionVotes: getPartyRegionVotes,
    getRegionQuotes: getRegionQuotes,
    getElectedParties: getElectedParties,
    getElectedPartiesVotesSum: getElectedPartiesVotesSum,
    getHareQuote: getHareQuote,
    getMinimumVotesToGetElected: getMinimumVotesToGetElected,
    getPartyVotesSum: getPartyVotesSum,
    getRealVotesSum: getRealVotesSum,
    getRegionVotes: getRegionVotes,
    getRegionMandates: getRegionMandates,
    getRegionPartyDistribution: getRegionPartyDistribution,
    getElectedPartiesDistribution: getElectedPartiesDistribution,
    getTotalMandates: getTotalMandates,
    setTotalMandates: setTotalMandates
};