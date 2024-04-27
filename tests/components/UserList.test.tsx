import { render, screen } from '@testing-library/react';
import { it, expect, describe } from 'vitest';
import UserList from '../../src/components/UserList';
import { User } from '../../src/entities';

describe('UserList', () => {
  it('should render no users when the users array is empty', () => {
    render(<UserList users={[]}/>);

    expect(screen.getByText(/no users/i)).toBeInTheDocument();
  });
  
  it('should render a list of users', () => {
    const users: User[] = [
      { id: 1, name: 'Nicolas 1' },
      { id: 2, name: 'Nicolas 2' },
      { id: 3, name: 'Nicolas 3' }
    ]
    render(<UserList users={users}/>);
    
    users.forEach(user => {
      const link = screen.getByRole('link', { name: user.name });

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', `/users/${user.id}`);
    });
  });
});