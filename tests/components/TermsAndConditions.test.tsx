import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { it, expect, describe } from 'vitest';
import TermsAndConditions from '../../src/components/TermsAndConditions';

describe('TermsAndConditions', () => {
  it('should render with correct text and initial state', () => {
    render(<TermsAndConditions />);

    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/terms & conditions/i);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('should enable the button when the checkbox is checked', async () => {
    //Arrange
    render(<TermsAndConditions />);
    
    // Act
    const checkbox = screen.getByRole('checkbox');
    const user = userEvent.setup();
    await user.click(checkbox);
    
    // Assert
    expect(screen.getByRole('button')).toBeEnabled();
  });
})