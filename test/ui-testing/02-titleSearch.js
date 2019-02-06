/* global it describe Nightmare before after */
module.exports.test = (context) => {
  describe('Codex Search by title', function titleSearchTest() {
    const { config, helpers: { login, logout, openApp }, meta: { testVersion } } = context;

    const nightmare = new Nightmare(config.nightmare);
    this.timeout(Number(config.test_timeout));

    const forContent = (c) => {
      const re = new RegExp(c, 'i');
      return !!Array.from(document.querySelectorAll('#list-search div[role="row"] > a div[role="gridcell"]'))
        .find(e => re.test(e.textContent));
    };

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
          .wait('button[type=submit]')
          .click('button[type=submit]')
          .wait(forContent, 'comics')
          .then(done)
          .catch(done);
      });

      // This needs both back-ends working, and makes assumptions about EKB content.
      // If the last one succeeds and this fails, it may be a changing-content issue.
      it('should find "a" title', (done) => {
        nightmare
          .wait('#clickable-reset-all')
          .click('#clickable-reset-all')
          .click('#clickable-filter-source-Local')
          .insert('#input-record-search', false)
          .insert('#input-record-search', 'a')
          .wait('button[type=submit]')
          .click('button[type=submit]')
          .wait(forContent, '14 cows')  // Inventory
          // .wait(forContent, 'Assholeology')  // EBSCO KB
          .then(done)
          .catch(done);
      });

      it('should link into the Inventory app and return', (done) => {
        nightmare
          .click('div[role="row"] div[title*="14 cows"]')
          .wait('#inventory-module-display')
          .wait('#list-inventory')
          .wait((c) => {
            const re = new RegExp(c, 'i');
            return !!Array.from(document.querySelectorAll('#list-inventory div[role="row"] > a div[role="gridcell"]'))
              .find(e => re.test(e.textContent));
          }, 'Deedy')
          // This would be a good moment to verify the state of the filters
          .back()
          .wait(forContent, '14 cows')
          .then(done)
          .catch(done);
      });

      it('should link into the eHoldings app and return', (done) => {
        nightmare
          .click('div[role="row"] div[title*="Assholeology"]')
          .wait('#eholdings-module-display')
          .wait('h1[data-test-eholdings-details-view-name="title"]')
          .evaluate(() => {
            const title = document.querySelector('h1[data-test-eholdings-details-view-name="title"]').textContent;
            const res = title.match('Asshole');
            console.log(`title='${title}', res='${res}'`);
            if (!res) throw new Error('incorrect title in eHoldings');
            return true;
          })
          // This would be a good moment to verify the state of the filters
          .back()
          .wait('div[role="row"] div[title*="Assholeology"]')
          .then(done)
          .catch(done);
      });
    });
  });
};
