'use strict';

// const ipcRenderer = require('electron').ipcRenderer;

var jquery = window.$ = window.jQuery = require('jquery');
var _ = require('lodash');
var data = require(__dirname + '/data/parliament-elections-2014-bulgaria.json');
var base = require(__dirname + '/js/largest_reminder_method/00_base.js');
var regionQuotes = require(__dirname + '/js/largest_reminder_method/01_region_quotes.js');
var votesMatrix = require(__dirname + '/js/largest_reminder_method/02_votes_matrix.js');
var nationalMandatesMatrix = require(__dirname + '/js/largest_reminder_method/03_national_mandates_matrix.js');

function createInfoContainer(message) {
    return $('<div class="info-message">' + message + '</div>');
}

var container = $('#main-container');
function append(node) {
    $(container).append(node);
}

function appendInfo(message) {
    append(createInfoContainer(message));
}

(function () {
    appendInfo("Районни избирателни квоти:");
    append(regionQuotes.getTable(data));

    appendInfo('Действителни гласове за партии и коалиции от партии по райони:');
    append(votesMatrix.getTable(data));

    appendInfo('Първа стъпка – разпределение на мандатите за всяка партия и коалиция на национално ниво');
    var realVotesSum = base.getRealVotesSum();
    appendInfo('Сума от всички действителни гласове: ' + realVotesSum);
    appendInfo('Четири на сто от действителните гласове в страната и извън страната: ' + base.getMinimumVotesToGetElected());
    appendInfo('Сума от действителни гласове за партии и коалиции от партии, които участват в разпределението на мандатите: ' + base.getElectedPartiesVotesSum())

    append(nationalMandatesMatrix.getNationalPartyMandatesMatrix());
})();
