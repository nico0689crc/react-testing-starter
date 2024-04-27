import { render, screen } from '@testing-library/react';
import { it, expect, describe } from 'vitest';
import ToastDemo from '../../src/components/ToastDemo';
import { Toaster } from 'react-hot-toast';
import userEvent from '@testing-library/user-event';

describe('ToastDemo', () => {
  const renderToastDemoComponent = () => {
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    );
  };
  
  it('should render the button to show the toast', () => {
    renderToastDemoComponent();

    screen.getByRole('button', {name: /show toast/i});
  })

  it('should render the toast component after click the button', async () => {
    renderToastDemoComponent();

    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: /show toast/i });

    await user.click(button);

    const toast = await screen.findByText(/success/i);

    expect(toast).toBeInTheDocument();
  });
});