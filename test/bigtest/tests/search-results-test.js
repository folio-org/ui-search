import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import SearchInteractor from '../interactors/search';

import {
  resourceTypes,
  sources,
  locations,
  holdingStatuses,
  languages,
} from '../../../src/Filters/model';

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

  it('has a search filter with a "title" option', function () {
    expect(Search.filter.title).to.equal('Title');
  });

  it('has a search filter with a "Folio ID" option', function () {
    expect(Search.filter.folioId).to.equal('FOLIO ID');
  });

  it('has a search filter with an "identifier" option', function () {
    expect(Search.filter.identifier).to.equal('Identifier');
  });

  it('has a search filter with a "isbn" option', function () {
    expect(Search.filter.isbn).to.equal('ISBN');
  });

  it('has a search filter with a "issn" option', function () {
    expect(Search.filter.issn).to.equal('ISSN');
  });

  it('has a search filter with a "subject" option', function () {
    expect(Search.filter.subject).to.equal('Subject');
  });

  it('has a search filter with a "publisher" option', function () {
    expect(Search.filter.publisher).to.equal('Publisher');
  });

  describe('Renders a Source menu', () => {
    it('should display source filters', () => {
      expect(Search.sourceList.items().length).to.equal(sources.length);
    });
  });

  describe('Renders a Resource type menu', () => {
    it('should display resource type filters', () => {
      expect(Search.resourceTypeList.items().length).to.equal(resourceTypes.length);
    });
  });

  describe('Renders a Location menu', () => {
    it('should display location filters', () => {
      expect(Search.locationList.items().length).to.equal(locations.length);
    });
  });

  describe('Renders a Holding Status menu', () => {
    it('should display holding status activeFilters', () => {
      expect(Search.holdingStatusList.items().length).to.equal(holdingStatuses.length);
    });
  });

  describe('Renders a Languages menu', () => {
    it('should display language filters', () => {
      expect(Search.languageList().length).to.equal(languages.length);
    });
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
