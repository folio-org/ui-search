import React from 'react';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  ViewMetaData: jest.fn(({ ...rest }) => (
    <div {...rest}>Metadata</div>
  )),
  ConfigManager: jest.fn(({ ...rest }) => <div {...rest}>ConfigManger</div>),
  Settings: jest.fn(({
    pages,
    paneTitle,
  }) => (
    <>
      <span>{paneTitle}</span>
      <span>{pages[0].route}</span>
      <span>{pages[0].label}</span>
      <span>{pages[1].route}</span>
      <span>{pages[1].label}</span>
      <span>{pages[2].route}</span>
      <span>{pages[2].label}</span>
      <span>{pages[3].route}</span>
      <span>{pages[3].label}</span>
    </>
  )),
  // eslint-disable-next-line react/prop-types
}), { virtual: true });
