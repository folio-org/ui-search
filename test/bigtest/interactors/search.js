import {
  interactor,
  collection,
  text
} from '@bigtest/interactor';

@interactor class SearchFilter {
  static defaultScope = '#input-record-search-qindex';

  title = text('option[value=title]');
  folioId = text('option[value=id]');
  identifier = text('option[value=identifier]');
  isbn = text('option[value="identifier/type=isbn"]');
  issn = text('option[value="identifier/type=issn"]');
  subject = text('option[value=subject]');
  publisher = text('option[value=publisher]');
}

@interactor class CheckgroupInteractor {
  items = collection('input[type="checkbox"]')
}

export default @interactor class SearchInteractor {
  static defaultScope = '[data-test-search]';

  filter = new SearchFilter();

  instances = collection('[role=row] a');

  sourceList = new CheckgroupInteractor('#source')
  resourceTypeList = new CheckgroupInteractor('#type')
  locationList = new CheckgroupInteractor('#location');
  holdingStatusList = new CheckgroupInteractor('#available');
  languageList = collection('ul[class^=multiSelectOptionList] li');
}
