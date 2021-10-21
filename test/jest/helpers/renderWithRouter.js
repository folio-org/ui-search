import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

const renderWithRouter = (children) => render(
  <MemoryRouter>{children}</MemoryRouter>
);

export default renderWithRouter;
