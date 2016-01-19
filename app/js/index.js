'use strict';

// const ipcRenderer = require('electron').ipcRenderer;

var jquery = window.$ = window.jQuery = require('jquery');
var _ = require('lodash');
var core = require(__dirname + '/js/largest_reminder_method/core.js');
var helpers = require(__dirname + '/js/largest_reminder_method/helpers.js');

function renderResults() {
    var container = $('#main-container');
    var resultsData = require(__dirname + '/js/largest_reminder_method/00_results_data.js');
    var nationaDistribution = require(__dirname + '/js/largest_reminder_method/01_national_distribution.js');
    var reginalDistribution = require(__dirname + '/js/largest_reminder_method/02_regional_distribution.js');

    helpers.append(container, resultsData.buildRegionQuotesSection());
    helpers.append(container, resultsData.buildPartyXRegionVotesSection());
    helpers.append(container, nationaDistribution.buildNationalPartyMandatesSection());
    helpers.append(container, reginalDistribution.buildRegionalDistributionSections());
}

renderResults();