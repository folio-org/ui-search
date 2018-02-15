const nullTest = require('./01-null.js');
const titleSearchTest = require('./02-titleSearch.js');

module.exports.test = (context) => {
  nullTest.test(context);
  titleSearchTest.test(context);
};
