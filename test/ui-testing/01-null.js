/* global it describe */

module.exports.test = (context) => {
  describe('Testing apparatus', function nullTest() {
    const { config } = context;

    this.timeout(Number(config.test_timeout));
    describe('Mocha', () => {
      it('works', () => {});
    });
  });
};
