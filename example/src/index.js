const fecha = require('fecha');
const fechaLocales = require('fecha-locales');

const tbody = document.getElementById('dates');
const formats = [
    'dddd MMMM Do, YYYY',
    'mediumDate',
    'hh:mm A'
];
const date = new Date();
const locales = Object.keys(fechaLocales);

const headRow = (() => {
    let row = '<tr>';
    row += '<th>locale</th>';

    formats.forEach((format) => row += '<th>' + format + '</th>');

    row += '</tr>';
    return row;
})();

const localeRows = locales.map((locale) => {
    fecha.i18n = fechaLocales[locale];

    let row = '<tr>';
    row += '<td>' + locale + '</td>';

    formats.forEach((format) => {
        row += '<td>' + fecha.format(date, format) + '</td>';
    });

    row += '</tr>';

    return row;
}).join('\n');

tbody.innerHTML = headRow + localeRows;
