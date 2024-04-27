import { render, screen } from '@testing-library/react';
import { it, expect, describe } from 'vitest';
import ExpandableText from '../../src/components/ExpandableText';
import userEvent from '@testing-library/user-event';

describe('ExpandableText - My Solution', () => {
  const textShorter = "a".repeat(255);
  const textLonger = "a".repeat(256);

  it('should render the text content without a button of show more if text is shorter than the limit', () => {
    render(<ExpandableText text={textShorter}/>);

    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();

    const textElement = screen.getByText(textShorter);
    const textElementWithEllipsi = screen.queryByText(`${textShorter}...`);

    expect(textElement).toBeInTheDocument();
    expect(textElementWithEllipsi).not.toBeInTheDocument();
  });

  it('should render the text content with elipsis if text is longer than the limit', () => {
    render(<ExpandableText text={textLonger}/>);

    const textElementWithEllipsi = screen.queryByText(`${textShorter}...`);
    expect(textElementWithEllipsi).toBeInTheDocument();
  });

  it('should render a button of show more initially if text is longer than the limit', () => {
    render(<ExpandableText text={textLonger}/>);

    const button = screen.getByRole('button', { name: /show more/i });

    expect(button).toBeInTheDocument();
  });

  it('should render the show less button when show more button is clicked', async () => {
    render(<ExpandableText text={textLonger}/>);
    
    const buttonShowMore = screen.getByRole('button', { name: /show more/i });
    
    const user = userEvent.setup();
    await user.click(buttonShowMore);

    const buttonShowLess = screen.getByRole('button', { name: /show less/i });

    expect(buttonShowLess).toBeInTheDocument();
  });

  it('should render the full text when the show more button is clicked', async () => {
    render(<ExpandableText text={textLonger}/>);
    
    const buttonShowMore = screen.getByRole('button', { name: /show more/i });

    const user = userEvent.setup();
    await user.click(buttonShowMore);

    expect(screen.getByText(textLonger)).toBeInTheDocument();
  });
});

describe('ExpandableText - Mosh Solution ', () => {
  const limit = 255;
  const longText = 'a'.repeat(limit + 1);
  const truncatedText = longText.substring(0, limit) + '...';

  it('should render the full text if less than 255 characters', () => {
    const text = "Short text";

    render(<ExpandableText text={text} />);

    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('should truncate text if longer than 255 characters', () => {
    render(<ExpandableText text={longText} />);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent(/more/i);
  });

  it('should expand text when Show More button is clicked', async () => {
    render(<ExpandableText text={longText} />);

    const button = screen.getByRole('button');
    const user = userEvent.setup();
    await user.click(button);

    expect(screen.getByText(longText)).toBeInTheDocument();
    expect(button).toHaveTextContent(/less/i);
  });

  it('should collapse text when Show Less button is clicked', async () => {
    render(<ExpandableText text={longText} />);
    const showMoreButton = screen.getByRole('button', { name: /more/i });
    const user = userEvent.setup();
    await user.click(showMoreButton);

    const showLessButton = screen.getByRole('button', { name: /less/i });
    await user.click(showLessButton);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    expect(showMoreButton).toHaveTextContent(/more/i);
  });
})