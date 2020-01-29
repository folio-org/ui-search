import {
  interactor,
  text,
} from '@bigtest/interactor';

export default @interactor class SearchFilter {
  static defaultScope = '#input-record-search-qindex';

  title = text('option[value=title]');
  folioId = text('option[value=id]');
  identifier = text('option[value=identifier]');
  isbn = text('option[value="identifier/type=isbn"]');
  issn = text('option[value="identifier/type=issn"]');
  subject = text('option[value=subject]');
  publisher = text('option[value=publisher]');
}
