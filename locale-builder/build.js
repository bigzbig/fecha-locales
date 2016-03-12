const fs = require('fs');
const path = require('path');
const convertMomentLocaleToFechaLocale = require('./lib/convertMomentLocaleToFechaLocale');

const momentLocalesPath = path.resolve(__dirname, './moment-locales');
const fechaLocalesPath = path.resolve(__dirname, '../');

fs.readdir(momentLocalesPath, (err, files) => {
    if (err) {
        console.error('Erorr while reading moment-locales');
        throw err;
    }

    files.forEach((localeFile) => {
        fs.readFile(path.resolve(momentLocalesPath, localeFile), 'utf-8', (err, momentLocale) => {
            if (err) {
                console.error('Error while reading moment-locale file', localeFile);
                throw err;
            }

            var fechaLocale,
                hasError;

            const conversionResult = convertMomentLocaleToFechaLocale(momentLocale, localeFile.split('.')[0]);
            fechaLocale = conversionResult.locale;
            hasError = conversionResult.hasError;

            if (hasError) {
                localeFile = `~${localeFile}~`;
            }

            fs.writeFile(path.resolve(fechaLocalesPath, localeFile), fechaLocale, 'utf-8', (err) => {
                if (err) {
                    console.error('Error while writing fecha locale', localeFile);
                    throw err;
                }
            });
        });
    });
});
