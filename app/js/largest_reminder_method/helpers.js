'use strict';

function cell(value) {
    return $('<td>' + value + '</td>');
}

function row(firstCell) {
    return $('<tr />').append(cell(firstCell));
}

function headerRow(firstCell) {
    return row(firstCell).addClass('header');
}

function emptyCell() {
    return cell('-');
}

function append(container, node) {
    container.append(node);
}

function appendSectionTitle(container, message) {
    container.append($('<div class="section-title">' + message + '</div>'));
}

function appendInfoMessage(container, message) {
    container.append($('<div class="info-message">' + message + '</div>'));
}

module.exports = {
    cell: cell,
    row: row,
    headerRow: headerRow,
    emptyCell: emptyCell,
    append: append,
    appendSectionTitle: appendSectionTitle,
    appendInfoMessage: appendInfoMessage
};