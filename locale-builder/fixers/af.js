const esprima = require('esprima');

module.exports = {
    ordinal: (node) => {
        console.warn('NODE**', node.type);

        return esprima.parse('function DoFn(n) { return n; };').body[0];
    }
};
