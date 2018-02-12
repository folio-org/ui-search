const Nightmare = require('nightmare');
const { describe, it } = require('mocha');

module.exports.test = (context) => {
  describe('Testing apparatus works', function bar() {
    const { config } = context;

    this.timeout(Number(config.test_timeout));
    const nightmare = new Nightmare(config.nightmare);

    describe('Mocha', () => {
      it('works', () => {});
    });

    describe('View login page', () => {
      it('should load login page', (done) => {
        nightmare
          .on('page', (_type = 'alert', message) => {
            throw new Error(message);
          })
          .goto(config.url)
          .wait(Number(config.login_wait))
          .then(() => { done(); })
          .catch(done);
      });
    });
  });
};
