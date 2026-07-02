import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider as LegacyToastProvider } from '../components/ui/Toast.jsx';
import { ToastProvider as FeedbackToastProvider } from '../components/ui/feedback/Toast.jsx';

export function renderWithProviders(ui, { route = '/', routerProps = {}, ...renderOptions } = {}) {
  function Wrapper({ children }) {
    return (
      <LegacyToastProvider>
        <FeedbackToastProvider>
          <MemoryRouter initialEntries={[route]} {...routerProps}>
            {children}
          </MemoryRouter>
        </FeedbackToastProvider>
      </LegacyToastProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';
