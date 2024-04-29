import { it, expect, describe } from 'vitest';
import { HttpResponse, http, delay } from 'msw';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';

import { server } from '../mocks/server';
import { db } from '../mocks/db';

import AllProviders from '../AllProviders';
import ProductList from '../../src/components/ProductList';

describe('ProductList', () => {
  const productIds : number[] = [];
  
  beforeAll(() =>  {
    Array(100).fill(0).forEach(() => {
      const product = db.product.create();
      productIds.push(product.id);
    })
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productIds } } })
  });

  it('should render the list of products', async () => {
    render(<ProductList />, { wrapper: AllProviders });

    const items  = await screen.findAllByRole('listitem');
    expect(items.length).toBeGreaterThan(0);
  });

  it('should render no products available if any product is found', async () => {
    server.use(http.get('/products', () => HttpResponse.json([])));
    
    render(<ProductList />, { wrapper: AllProviders });

    const message = await screen.findByText(/no products/i);

    expect(message).toBeInTheDocument();
  });

  it('should render an error message when there is an error', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));

    render(<ProductList />, { wrapper: AllProviders });

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it('should render a loading indicator when fetching data', async () => {
    server.use(http.get('/products', async () => {
      await delay();
      return HttpResponse.json([]);
    }));

    render(<ProductList />, { wrapper: AllProviders });

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  it('should remove the loading indicator after data is fetched.', async () => {
    render(<ProductList />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it('should remove the loading indicator after data is fail.', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));

    render(<ProductList />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});