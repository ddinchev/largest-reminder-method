'use strict';

// const ipcRenderer = require('electron').ipcRenderer;

var jquery = window.$ = window.jQuery = require('jquery');
var _ = require('lodash');
var data = require(__dirname + '/data/parliament-elections-2014-bulgaria.json');
var base = require(__dirname + '/js/largest_reminder_method/00_base.js');
var regionQuotes = require(__dirname + '/js/largest_reminder_method/01_region_quotes.js');
var votesMatrix = require(__dirname + '/js/largest_reminder_method/02_votes_matrix.js');
var nationalMandatesMatrix = require(__dirname + '/js/largest_reminder_method/03_national_mandates_matrix.js');

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

(function () {
    appendSubSection("Районни избирателни квоти:");
    append(regionQuotes.createTable(data));

    appendInfoMessage('Действителни гласове за партии и коалиции от партии по райони:');
    append(votesMatrix.createTable(data));

    appendSubSection('Първа стъпка – разпределение на мандатите за всяка партия и коалиция на национално ниво');
    appendInfoMessage('Сума от всички действителни гласове: ' + base.getRealVotesSum());
    appendInfoMessage('Четири на сто от действителните гласове в страната и извън страната: ' + base.getMinimumVotesToGetElected());
    appendInfoMessage('Сума от действителни гласове за партии и коалиции от партии, които участват в разпределението на мандатите: ' + base.getElectedPartiesVotesSum());
    appendInfoMessage('Квота на Хеър: ' + base.getHareQuote(base.getElectedPartiesVotesSum(), 240));

    append(nationalMandatesMatrix.buildNationalPartyMandatesMatrix());
})();
