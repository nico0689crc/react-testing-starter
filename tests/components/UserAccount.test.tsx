import { render, screen } from '@testing-library/react';
import { it, expect, describe } from 'vitest';
import UserAccount from '../../src/components/UserAccount';

import { User } from '../../src/entities';

describe('UserAccount', () => {

  const user: User = {
    id: 1,
    name: 'User Name',
    isAdmin: true
  };

  it('should display the name of the user into the component', () => {
    render(<UserAccount user={user}/>);

    expect(screen.queryByText(user.name)).toBeInTheDocument();
  });

  it('should display edit button if the user is an Admin', () => {
    render(<UserAccount user={user}/>);

    // My solution
    expect(screen.queryByText(/edit/i)).toBeInTheDocument();

    // Mosh solution
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/edit/i);
  });

  it('should not display edit button if the user is not an Admin', () => {
    render(<UserAccount user={{...user, isAdmin: false}}/>);

    // My solution
    expect(screen.queryByText(/edit/i)).not.toBeInTheDocument();

    // Mosh solution
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
})