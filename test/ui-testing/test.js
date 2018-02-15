const nullTest = require('./01-null.js');
const titleSearchTest = require('./02-titleSearch.js');
const codex = require('./codex.js');

module.exports.test = (context) => {
  nullTest.test(context);
  titleSearchTest.test(context);
  codex.test(context);
};
