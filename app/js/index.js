'use strict';

// const ipcRenderer = require('electron').ipcRenderer;

var jquery = window.$ = window.jQuery = require('jquery');
var _ = require('lodash');
var core = require(__dirname + '/js/largest_reminder_method/core.js');
var helpers = require(__dirname + '/js/largest_reminder_method/helpers.js');

function renderResults() {
    var resultsData = require(__dirname + '/js/largest_reminder_method/00_results_data.js');
    var nationalMandatesMatrix = require(__dirname + '/js/largest_reminder_method/01_national_mandates_matrix.js');

    var container = $('#main-container');

    function append(node) {
        $(container).append(node);
    }

    function appendSubSection(message) {
        $(container).append($('<div class="sub-section">' + message + '</div>'));
    }

    function appendInfoMessage(message) {
        $(container).append($('<div class="info-message">' + message + '</div>'));
    }

    appendSubSection("Районни избирателни квоти:");
    append(resultsData.buildRegionQuotesMatrix());
    appendSubSection('Действителни гласове за партии и коалиции от партии по райони:');
    append(resultsData.buildPartyXRegionVotesMatrix());

    appendSubSection('Първа стъпка – разпределение на мандатите за всяка партия и коалиция на национално ниво:');
    appendInfoMessage('Сума от всички действителни гласове: ' + core.getRealVotesSum());
    appendInfoMessage('Четири на сто от действителните гласове в страната и извън страната: ' + core.getMinimumVotesToGetElected());
    appendInfoMessage('Сума от действителни гласове за партии и коалиции от партии, които участват в разпределението на мандатите: ' + core.getElectedPartiesVotesSum());
    appendInfoMessage('Квота на Хеър: ' + core.getHareQuote(core.getElectedPartiesVotesSum(), 240));
    append(nationalMandatesMatrix.buildNationalPartyMandatesMatrix());

    appendSubSection('Втора стъпка – разпределение на спечелените мандати за всяка партия или коалиция в многомандатните избирателни райони:');
    _.each(core.getRegionMandates(), function (mandates, regionId) {
        var regionName = core.getRegions()[regionId].toUpperCase();
        appendInfoMessage('Разпределение на мандатите в МИР ' + regionName.toUpperCase());
        appendInfoMessage('Действителни гласове за партии и коалиции от партии, участващи в разпределение: ');
        appendInfoMessage('Брой мандати в ' + regionName.toUpperCase() + ': ' + mandates);
        debugger;
    });
}

renderResults();