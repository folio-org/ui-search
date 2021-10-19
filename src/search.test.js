import React from 'react';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';

import '../test/jest/__mock__';
import buildStripes from '../test/jest/__mock__/stripesCore.mock';

import Routing from './index';

const stripes = buildStripes();
const match = {
  path:'/codexsearch',
};

jest.mock('@folio/stripes-core', () => ({
  ...jest.requireActual('@folio/stripes-core'),
  withStripes : Component => ({ ...rest }) => {
    const fakeStripes = {
      connect: component => component,
      hasPerm: () => true,
      logger: {
        log: jest.fn(),
      }
    };

    return (
      <Component
        {...rest}
        stripes={fakeStripes}
      />
    );
  },
}));

const renderRouting = (showSettings) => (
  render(
    <MemoryRouter initialEntries={['/codexsearch']}>
      <Routing
        match={match}
        stripes={stripes}
        showSettings={showSettings}
      />
    </MemoryRouter>
  )
);

describe('Routing', () => {
  it('should render settings', () => {
    renderRouting(true);

    expect(screen.getByText('These are the settings.')).toBeVisible();
  });

  it('should render search', () => {
    renderRouting(false);

    expect(screen.getByRole('region', { name: /source filter list/ })).toBeVisible();
  });
});
