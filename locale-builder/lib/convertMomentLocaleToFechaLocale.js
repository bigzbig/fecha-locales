const esprima = require('esprima');
const estraverse = require('estraverse');
const estemplate = require('estemplate');
const escodegen = require('escodegen');

module.exports = (momentLocale, name) => {
    const momentLocaleAst = esprima.parse(momentLocale);
    const fechaLocaleTemplate = `(function () {
      var locale = {
        amPm: <%= amPm %>,
        DoFn: <%= DoFn %>,
        dayNames: <%= dayNames %>,
        dayNamesShort: <%= dayNamesShort %>,
        monthNames: <%= monthNames %>,
        monthNamesShort: <%= monthNamesShort %>
      };

      if (typeof module !== 'undefined' && typeof module.exports === 'object') {
          module.exports = locale;
      } else if (window && window.window === window) {
          window.fechaLocales = window.fechaLocales || {};
          window.fechaLocales['${name}'] = locale;
      }
    })();
`;
    const templateProps = {
        amPm: esprima.parse('["am", "pm"]').body[0].expression
    };

    var hasError = false;
    const responsiblyGetNodeValue = (node, type) => {
        if (node.value.type !== type) {
            console.warn(`Invalid value for \`${node.key.name}\` of "${name}.js". Please fix it manually.`);
            hasError = true;
        }

        return node.value;
    };

    estraverse.traverse(momentLocaleAst, {
        enter: (node) => {
            if (node.type === 'Property') {
                switch (node.key.name) {
                case 'ordinal':
                    if (node.value.type === 'FunctionExpression') {
                        templateProps.DoFn = responsiblyGetNodeValue(node, 'FunctionExpression'.value);
                    }
                    break;
                case 'months':
                    templateProps.monthNames = responsiblyGetNodeValue(node, 'CallExpression');
                    break;
                case 'weekdays':
                    templateProps.dayNames = responsiblyGetNodeValue(node, 'CallExpression');
                    break;
                case 'weekdaysShort':
                    templateProps.dayNamesShort = responsiblyGetNodeValue(node, 'CallExpression');
                    break;
                case 'monthsShort':
                    templateProps.monthNamesShort = responsiblyGetNodeValue(node, 'CallExpression');
                    break;
                }
            }
        }
    });

    if (typeof templateProps.DoFn === 'undefined') {
        templateProps.DoFn = esprima.parse('function DoFn(n) { return n; };').body[0];
    }

    const fechaLocaleAst = estemplate(fechaLocaleTemplate, templateProps);

    const fechaLocale = escodegen.generate(fechaLocaleAst);

    return {
        locale: fechaLocale,
        hasError: hasError
    };
};
