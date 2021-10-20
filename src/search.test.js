import React from 'react';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import '../test/jest/__mock__';
import buildStripes from '../test/jest/__mock__/stripesCore.mock';

import Routing from './index';

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

jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ width: 1920, height: 1080 }));

const stripes = buildStripes();
const match = {
  path:'/codexsearch',
};

const records = [{
  id : '1b74ab75-9f41-4837-8662-a1d99118008d',
  title : 'A journey through Europe Bildtontraeger high-speed lines European Commission, Directorate-General for Mobility and Transport',
  contributor : [{
    type : 'Corporate name',
    name : 'Europäische Kommission Generaldirektion Mobilität und Verkehr'
  }],
  subject : [],
  type : 'unspecified',
  identifier : [{
    value : '(DE-599)GBV643935371',
    type : 'System control number'
  }, {
    value : '10.2768/21035',
    type : 'Other standard identifier'
  }, {
    value : '643935371',
    type : 'Control number'
  }, {
    value : 'MI-32-10-386-57-Z',
    type: 'Publisher or distributor number'
  }, {
    value: '9789279164316',
    type: 'ISBN'
  }],
  'source' : 'kb',
  'language' : ['ger', 'eng', 'spa', 'fre', 'ita', 'dut', 'por']
},
];

const resources = {
  query: {
    filters: 'available.true,source.local',
    qindex: 'title',
    query: 'e',
    sort: 'title',
  },
  records: {
    records,
    hasLoaded: true,
    other: {
      totalRecords: 1
    }
  }
};

const mutator = {
  query: {
    update: jest.fn(),
    replace: jest.fn(),
  },
  resultCount: {
    update: jest.fn(),
    replace: jest.fn(),
  },
  records: {
    GET: jest.fn(() => Promise.resolve()),
  }
};

const renderRouting = (showSettings) => {
  window.history.pushState({}, 'Test page', '/codexsearch');
  return render(
    <MemoryRouter initialEntries={['/codexsearch']}>
      <Routing
        match={match}
        stripes={stripes}
        mutator={mutator}
        resources={resources}
        showSettings={showSettings}
      />
    </MemoryRouter>
  );
};

describe('Routing', () => {
  it('should render settings', () => {
    renderRouting(true);

    expect(screen.getByText('These are the settings.')).toBeVisible();
  });

  it('should render search', () => {
    renderRouting(false);

    const inputSearch = screen.getByRole('searchbox', { name: /searchFieldLabel/ });
    const localCheckbox = screen.getByRole('checkbox', { name: /sources.local/ });

    user.type(inputSearch, 'test');
    user.click(localCheckbox);

    expect(screen.getByRole('gridcell', { name: /A journey through Europe/ })).toBeVisible();
  });

  it('should open record details when click on item', () => {
    renderRouting(false);

    const inputSearch = screen.getByRole('searchbox', { name: /searchFieldLabel/ });
    const localCheckbox = screen.getByRole('checkbox', { name: /sources.local/ });
    const item = screen.getByRole('link', { name: /A journey through Europe/ });

    user.type(inputSearch, 'test');
    user.click(localCheckbox);
    user.click(item);

    expect(mutator.query.update).toHaveBeenCalled();
    // expect(screen.getByRole('textbox', { name: /test/ }));
  });
});
