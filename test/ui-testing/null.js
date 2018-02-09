module.exports.test = function meh(uitestctx) {
  describe('Module test: users:new_user', function bar() {
    const { config, helpers: { namegen, openApp }, meta: { testVersion } } = uitestctx;

    this.timeout(Number(config.test_timeout));
    const nightmare = new Nightmare(config.nightmare);

    let pgroup = null;
    const user = namegen();

    describe('Testing apparatus works', () => {
      it('should load login page', (done) => {
        nightmare
        .on('page', (type = 'alert', message) => {
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
