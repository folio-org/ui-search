import React from 'react';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import '../test/jest/__mock__';
import buildStripes from '../test/jest/__mock__/stripesCore.mock';

import Routing from './index';

jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ width: 1920, height: 1080 }));

const stripes = buildStripes();
const match = {
  path:'/codexsearch',
};

const records = [
  {
    id: '1',
    title: 'Record title 1',
    contributor: [{
      type: 'Corporate name',
      name: 'Europäische Kommission Generaldirektion Mobilität und Verkehr'
    }],
    subject: [],
    type: 'unspecified',
    identifier: [{
      value: '(DE-599)GBV643935371',
      type: 'System control number'
    }],
    'source': 'local',
  },
  {
    id: '2',
    title: 'Record title 2',
    contributor: [{
      type: 'Corporate name',
      name: 'Europäische Kommission Generaldirektion Mobilität und Verkehr'
    }],
    subject: [],
    type: 'unspecified',
    identifier: [{
      value: '(DE-599)GBV643935371',
      type: 'System control number'
    }],
    'source': 'kb',
  },
  {
    id: '3',
    contributor: [{
      type: 'Corporate name',
      name: 'Europäische Kommission Generaldirektion Mobilität und Verkehr'
    }],
    subject: [],
    type: 'unspecified',
    identifier: [{
      value: '(DE-599)GBV643935371',
      type: 'System control number'
    }],
    'source': 'local',
  },

];

const resources = {
  query: {
    filters: 'available.true',
    qindex: 'title',
    query: 'e',
    sort: 'title',
  },
  records: {
    records,
    hasLoaded: true,
    isPending: false,
    other: {
      totalRecords: 3
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

jest.mock('@folio/stripes-core', () => ({
  ...jest.requireActual('@folio/stripes-core'),
  withStripes: Component => ({ ...rest }) => {
    const fakeStripes = {
      connect: ConnectedComponent => ({ ...restProps }) => (
        <ConnectedComponent
          resources={
            {
              record: {
                records,
                hasLoaded: true,
                other: {
                  totalRecords: 3
                }
              }
            }
          }
          {...restProps}
        />
      ),
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

jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  defer: jest.fn(fn => fn())
}));

const renderRouting = (showSettings, route) => {
  const path = ['/codexsearch', route].join('');

  return render(
    <MemoryRouter initialEntries={[path]}>
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
    const localCheckbox = screen.getByRole('checkbox', { name: /sources.kb/ });
    const indexSelect = screen.getByRole('combobox', { name: /searchFieldIndex/ });
    // const titleOption = screen.getByRole('option', { name: /searchableIndexes.subject/ });

    // user.click(indexSelect);
    // user.click(titleOption);
    // console.log(`localCheckbox`, localCheckbox)
    user.selectOptions(indexSelect, 'ui-search.searchableIndexes.identifier');
    user.type(inputSearch, 'test');
    user.click(localCheckbox);

    expect(screen.getByRole('gridcell', { name: 'Record title 1' })).toBeVisible();
  });

  it('should redirect to record details when click on item', () => {
    renderRouting(false);

    const inputSearch = screen.getByRole('searchbox', { name: /searchFieldLabel/ });
    const localCheckbox = screen.getByRole('checkbox', { name: /sources.local/ });
    const item = screen.getByRole('link', { name: /Record title 1/ });

    user.type(inputSearch, 'test');
    user.click(localCheckbox);
    user.click(item);

    expect(mutator.query.update).toHaveBeenCalled();
  });

  it('should open record details', () => {
    renderRouting(false, '/view/3');

    expect(screen.getByTestId('search-instance-details')).toBeVisible();
    expect(screen.getByText('Contributors')).toBeVisible();
  });
});
