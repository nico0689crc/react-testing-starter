import { render, screen } from '@testing-library/react';
import { it, expect, describe } from 'vitest';
import SearchBox from '../../src/components/SearchBox';
import userEvent from '@testing-library/user-event';

describe('SeachBox - My solution', () => {
  const renderSearchBoxComponent = async (typeText = '') => {
    const onChange = vi.fn();
    render(<SearchBox onChange={onChange} />);

    const input = screen.getByPlaceholderText(/search/i);

    const user = userEvent.setup();
    await user.type(input, `${typeText}{enter}`);

    return {
      input,
      user,
      onChange
    }
  }

  it('should render the searchbox input', async () => {
    const {input} = await renderSearchBoxComponent();

    expect(input).toBeInTheDocument();
  });

  it('should not call onChange function if the input text is empty and enter is press', async () => {
    const { onChange } = await renderSearchBoxComponent();

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should call onChange function if the input is not empty and enter is press', async () => {
    const { onChange } = await renderSearchBoxComponent("aaaaa");

    expect(onChange).toHaveBeenCalled();
  });
});

describe("SearchBox - Mosh Solution", () => {
  const renderSearchBox = () => {
    const onChange = vi.fn();
    render(<SearchBox onChange={onChange} />);

    return {
      input: screen.getByPlaceholderText(/search/i),
      user: userEvent.setup(),
      onChange,
    };
  };

  it("should render an input field for searching", () => {
    const { input } = renderSearchBox();

    expect(input).toBeInTheDocument();
  });

  it("should call onChange when Enter is pressed", async () => {
    const { input, onChange, user } = renderSearchBox();

    const searchTerm = "SearchTerm";
    await user.type(input, searchTerm + "{enter}");

    expect(onChange).toHaveBeenCalledWith(searchTerm);
  });

  it("should not call onChange if input field is empty", async () => {
    const { input, onChange, user } = renderSearchBox();

    await user.type(input, "{enter}");

    expect(onChange).not.toHaveBeenCalled();
  });
});