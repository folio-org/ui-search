import {
  interactor,
  collection,
} from '@bigtest/interactor';

export default @interactor class SearchInteractor {
  static defaultScope = '[data-test-search]';

  instances = collection('[role=listitem] a');
}
