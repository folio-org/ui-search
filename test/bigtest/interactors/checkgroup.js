import {
  interactor,
  collection,
} from '@bigtest/interactor';

export default @interactor class CheckgroupInteractor {
  items = collection('input[type="checkbox"]')
}
