const Nightmare = require('nightmare');
const { describe, it, before, after } = require('mocha');

module.exports.test = (context) => {
  describe('Codex Search by title', function titleSearchTest() {
    const { config, helpers: { login, logout, openApp }, meta: { testVersion } } = context;

    const nightmare = new Nightmare(config.nightmare);
    this.timeout(Number(config.test_timeout));

    describe('Login > Check app > Inventory search > Cross-search > Logout', () => {
      before(done => login(nightmare, config, done));
      after(done => logout(nightmare, config, done));

      it('should open module "Search" and find version tag', (done) => {
        nightmare
          .use(openApp(nightmare, config, done, 'search', testVersion))
          .then(result => result)
          .catch(done);
      });

      // This one depends only on inventory, so should be reliable.
      it('should find "monster comics" title', (done) => {
        nightmare
          .wait('#input-record-search-qindex')
          .select('#input-record-search-qindex', 'title')
          .click('#clickable-filter-source-Local')
          .insert('#input-record-search', 'monster')
          .wait('div[role="listitem"] div[title*="comics"]')
          .then(done)
          .catch(done);
      });

      // This needs both back-ends working, and makes assumptions about EKB content.
      // If the last one succeeds and this fails, it may be a changing-content issue.
      it('should find "a" title', (done) => {
        nightmare
          .click('#clickable-filter-source-Local')
          .insert('#input-record-search', false)
          .insert('#input-record-search', 'a')
          .wait('div[role="listitem"] div[title*="14 cows"]') // Inventory
          .wait('div[role="listitem"] div[title*="Assholeology"]') // ESBCO KB
          .then(done)
          .catch(done);
      });

      it('should link into the Inventory app and return', (done) => {
        nightmare
          .click('div[role="listitem"] div[title*="14 cows"]')
          .wait('#inventory-module-display')
          .wait('div[role="gridcell"][title*="Deedy"]')
          // This would be a good moment to verify the state of the filters
          .back()
          .wait('div[role="listitem"] div[title*="14 cows"]')
          .then(done)
          .catch(done);
      });

      it('should link into the eHoldings app and return', (done) => {
        nightmare
          .click('div[role="listitem"] div[title*="Assholeology"]')
          .wait('#eholdings-module-display')
          .wait('h1[data-test-eholdings-details-view-name="title"]')
          .wait(() => {
            const title = document.querySelector('h1[data-test-eholdings-details-view-name="title"]').textContent;
            const res = title.match('Asshole');
            console.log(`title='${title}', res='${res}'`);
            if (!res) throw new Error('incorrect title in eHoldings');
            return true;
          })
          // This would be a good moment to verify the state of the filters
          .back()
          .wait('div[role="listitem"] div[title*="Assholeology"]')
          .then(done)
          .catch(done);
      });
    });
  });
};
