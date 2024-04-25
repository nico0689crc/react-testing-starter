import { render, screen  } from '@testing-library/react';

import Greet from '../../src/components/Greet';


describe('Greet', () => {
  it('should render Hello with the name when the name is provided', () => {
    render(<Greet name='Nicolas'/>);

    // screen.debug();
    const heading = screen.getByRole('heading');

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/hello nicolas/i)
  });

  it('should render Login Button when name is not provided', () => {
    render(<Greet />);

    // screen.debug();
    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/login/i)
  });
});