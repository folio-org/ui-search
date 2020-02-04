import {
  interactor,
  collection,
} from '@bigtest/interactor';

import SearchFilter from './search-filter';
import CheckgroupInteractor from './checkgroup';

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
