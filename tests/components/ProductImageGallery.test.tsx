import { render, screen } from '@testing-library/react';
import { it, expect, describe } from 'vitest';
import ProductImageGallery from '../../src/components/ProductImageGallery';

describe('ProductImageGallery', () => {
  it('should render an empty component if an empty array of images is provided', () => {
    const { container } = render(<ProductImageGallery imageUrls={[]}/>);
    expect(container.firstChild).toBeNull();
  });

  it('should a list of images if an array of images is provided', () => {
    const images = [
      "http://jasuwos.mv/uftot1",
      "http://jasuwos.mv/uftot2",
      "http://jasuwos.mv/uftot3"
    ];

    render(<ProductImageGallery imageUrls={images}/>);

    expect(screen.queryByRole('list')).toBeInTheDocument();

    const imagesElements = screen.getAllByRole('img');

    expect(imagesElements).toHaveLength(images.length);

    imagesElements.forEach((image, index) => {
      expect(image).toHaveAttribute('src', images[index]);
    });
  });
})