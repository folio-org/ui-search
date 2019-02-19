import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import SearchInteractor from '../interactors/search';

describe('Search results', () => {
  setupApplication();

  const Search = new SearchInteractor();
  const INSTANCES_NUMBER = 3;
  let instances;

  beforeEach(function () {
    instances = this.server.createList('codex-instance', INSTANCES_NUMBER);
    this.visit('/codexsearch?filters=available.true&qindex=title&sort=title');
  });

  it('should display empty search results list by default', () => {
    expect(Search.instances().length).to.equal(0);
  });

  describe('on search', () => {
    beforeEach(async () => {
      await Search
        .fill('#input-record-search-qindex', 'title')
        .fill('#input-record-search', 'title name')
        .click('button[type="submit"]');
    });

    it('should display search results list', () => {
      expect(Search.instances().length).to.equal(INSTANCES_NUMBER);
    });

    describe('after click on the first item', () => {
      beforeEach(async () => {
        await Search.instances(0).click();
      });

      it('should redirect to Inventory app for displaying item details page', function () {
        const itemDetailsUrl = `/inventory/view/${instances[0].id}`;

        expect(this.location.pathname).to.contain(itemDetailsUrl);
      });
    });
  });
});
