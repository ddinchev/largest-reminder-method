'use strict';

function cell(value) {
    return $('<td>' + value + '</td>');
}

function row(firstCell) {
    return $('<tr />').append(cell(firstCell));
}

function emptyCell() {
    return cell('-');
}

module.exports = {
    cell: cell,
    row: row,
    emptyCell: emptyCell
};