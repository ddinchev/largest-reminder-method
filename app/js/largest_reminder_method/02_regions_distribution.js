'use strict';

var core = require(__dirname + '/core.js');
var helpers = require(__dirname + '/helpers.js');

function buildMandatesByRegionStep() {
    _.each(core.getRegions(), function (regionName, regionId) {
        debugger;
    });
}


function buildRegionElectedPartyMandatesSection(regionId) {
    // var table = $('<table class="region-party-mandates" />');
}

module.exports = {
    buildMandatesByRegionStep: buildMandatesByRegionStep
};