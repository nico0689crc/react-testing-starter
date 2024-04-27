import { HttpResponse, http, delay } from 'msw';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { it, expect, describe } from 'vitest';

import { server } from '../mocks/server';
import { db } from '../mocks/db';

import ProductDetail from '../../src/components/ProductDetail';

describe('ProductDetail', () => {
  const productIds : number[] = [];
  
  beforeAll(() =>  {
    Array(1).fill(0).forEach(() => {
      const product = db.product.create();

      productIds.push(product.id);
    })
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productIds } } })
  });

  it('should render loading message when the component is rendered and productId is valid', () => {
    server.use(http.get('/products', async () => {
      await delay();
      return HttpResponse.json([]);
    }));

    render(<ProductDetail productId={1} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should remove the loading indicator after data is fetched.', async () => {
    render(<ProductDetail productId={productIds[0]}/>);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it('should remove the loading indicator after data is fail.', async () => {
    server.use(http.get('/products/1', () => HttpResponse.error()));

    render(<ProductDetail productId={1}/>);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
  
  it('should render an invalid message if productId is invalid.', () => {
    render(<ProductDetail productId={0} />);

    expect(screen.getByText(/invalid/i)).toBeInTheDocument();
  });

  it('should render a not found message if product is not found.', async () => {
    server.use(http.get('/products/999', () => HttpResponse.json(null)));

    render(<ProductDetail productId={999} />);

    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  it('should render the product detail', async () => {
    const productId = productIds[0];
    const product = db.product.findFirst({ where: { id: { equals: productId } }});

    render(<ProductDetail productId={productId} />);

    if(product) {
      expect(await screen.findByText(new RegExp(product.name))).toBeInTheDocument();
      expect(await screen.findByText(new RegExp(product.price.toString()))).toBeInTheDocument();
    }
  });
})