import { it, expect, describe } from 'vitest';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import BrowseProducts from '../../src/pages/BrowseProductsPage';
import AllProviders from '../AllProviders';
import { server } from '../mocks/server';
import { HttpResponse, http } from 'msw';
import { db, getProductsByCategory } from '../mocks/db';
import { Category, Product } from '../../src/entities';
import userEvent from '@testing-library/user-event';
import { simulateDelay, simulateError } from '../utils';

/* 
  Working methodically:
    - Testing Loading State
    - Testing Error Handling
    - Testing Data rendering 
*/

describe('BrowseProductPage - My Solution', () => {
  const categoriesLength = 5;
  const productsLength = 50;
  
  const products : Product[] = [];
  const categories: Category[] = [];

  const renderBrowseProducts = () => {
    render(<BrowseProducts />, { wrapper: AllProviders });

    const user = userEvent.setup();
  
    return {
      user
    }
  }

  beforeAll(() => {
    Array(categoriesLength).fill(0).forEach(() => {
      const category = db.category.create();

      categories.push(category);
    });

    Array(productsLength).fill(0).forEach(() => {
      const randomIndex = Math.floor(Math.random() * (categoriesLength - 1));

      const product = db.product.create({ categoryId: categories[randomIndex].id });

      products.push(product);
    });
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: products.map(product => product.id) } } });
    db.category.deleteMany({ where: { id: { in: categories.map(category => category.id) } } });
  });

  it('should render skeleton while fetching data', () => {
    renderBrowseProducts();

    const skeletons = screen.queryAllByTestId('skeleton-loader');

    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should remove skeleton after fetching data finished successfully', async () => {
    server.use(http.get('/products', () => HttpResponse.json([])));
    server.use(http.get('/categories', () => HttpResponse.json([])));

    renderBrowseProducts();
    
    await waitForElementToBeRemoved(() => screen.queryAllByTestId('skeleton-loader'));
  });

  it('should remove skeleton after fetching data finished with error', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));
    server.use(http.get('/categories', () => HttpResponse.error()));

    renderBrowseProducts();
    
    await waitForElementToBeRemoved(() => screen.queryAllByTestId('skeleton-loader'));
  });

  it('should render error message when fetching product\'s data finished with error', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));

    renderBrowseProducts();

    const message = await screen.findByText(/error/i);

    expect(message).toBeInTheDocument();
  });

  it('should not render category selector when fetching category\'s data finished with error', async () => {
    server.use(http.get('/categories', () => HttpResponse.error()));

    renderBrowseProducts();

    const combobox = screen.queryByRole('combobox');

    expect(combobox).not.toBeInTheDocument();
  });

  it('should render products when fetching products\' data finished successfully', async () => {
    renderBrowseProducts();

    const productsRendered = await screen.findAllByText(/\$/);

    expect(productsRendered.length).toEqual(productsLength);

    products.forEach((product) => {
      const productName = screen.queryAllByText(new RegExp(product.name));

      expect(productName).not.toBeNull();
    });
  });

  it('should render categories when fetching categories\' data finished successfully', async () => {
    renderBrowseProducts();
    
    const categoriesCombobox = await screen.findByRole('combobox');

    expect(categoriesCombobox).toBeInTheDocument();
  });

  //Interactive testing
  it('should render category\'s list when clicking on the category\'s selector', async () => {
    const { user } = renderBrowseProducts();

    const combobox = await screen.findByRole('combobox');
    
    await user.click(combobox);

    const filterAllItem = screen.getAllByText(/all/i);

    expect(filterAllItem.length).toBeGreaterThan(0);

    categories.forEach(category => {
      const categories = screen.getAllByText(new RegExp(category.name));

      expect(categories.length).toBeGreaterThan(0);
    });
  });
  
  it('should render products filtered by the category selected', async () => {
    const { user } = renderBrowseProducts();

    const combobox = await screen.findByRole('combobox');
    await user.click(combobox);

    const option = screen.getAllByRole('option', { name: categories[0].name });
    await user.click(option[0]);
    
    const productsRendered = await screen.findAllByText(/\$/);
    const productsFiltered = getProductsByCategory(categories[0].id);

    expect(productsRendered.length).toEqual(productsFiltered.length);
  });

  it('should render products filtered by the All category selected when rendering', async () => {
    const { user } = renderBrowseProducts();

    const combobox = await screen.findByRole('combobox');
    await user.click(combobox);

    const option = screen.getByRole('option', { name: /all/i });
    await user.click(option);
    
    const productsRendered = await screen.findAllByText(/\$/);

    expect(productsRendered.length).toEqual(products.length);
  });
});


describe("BrowseProductsPage - Mosh Solution", () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  const renderComponent = () => {
    render(<BrowseProducts />, { wrapper: AllProviders });
  
    const getCategoriesSkeleton = () =>
      screen.queryByRole("progressbar", {
        name: /categories/i,
      });
  
    const getProductsSkeleton = () =>
      screen.queryByRole("progressbar", { name: /products/i });
  
    const getCategoriesComboBox = () =>
      screen.queryByRole("combobox");
  
    const selectCategory = async (name: RegExp | string) => {
      await waitForElementToBeRemoved(getCategoriesSkeleton);
      const combobox = getCategoriesComboBox();
      const user = userEvent.setup();
      await user.click(combobox!);
  
      const option = screen.getByRole("option", { name });
      await user.click(option);
    };
  
    const expectProductsToBeInTheDocument = (
      products: Product[]
    ) => {
      const rows = screen.getAllByRole("row");
      const dataRows = rows.slice(1);
      expect(dataRows).toHaveLength(products.length);
  
      products.forEach((product) => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });
    };
  
    return {
      getProductsSkeleton,
      getCategoriesSkeleton,
      getCategoriesComboBox,
      selectCategory,
      expectProductsToBeInTheDocument,
    };
  };

  beforeAll(() => {
    [1, 2].forEach((item) => {
      const category = db.category.create({ name: 'Category ' + item });
      categories.push(category);
      [1, 2].forEach(() => {
        products.push(
          db.product.create({ categoryId: category.id })
        );
      });
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    db.category.deleteMany({
      where: { id: { in: categoryIds } },
    });

    const productIds = products.map((p) => p.id);
    db.product.deleteMany({
      where: { id: { in: productIds } },
    });
  });

  it("should show a loading skeleton when fetching categories", () => {
    simulateDelay("/categories");

    const { getCategoriesSkeleton } = renderComponent();

    expect(getCategoriesSkeleton()).toBeInTheDocument();
  });

  it("should hide the loading skeleton after categories are fetched", async () => {
    const { getCategoriesSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);
  });

  it("should show a loading skeleton when fetching products", () => {
    simulateDelay("/products");

    const { getProductsSkeleton } = renderComponent();

    expect(getProductsSkeleton()).toBeInTheDocument();
  });

  it("should hide the loading skeleton after products are fetched", async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);
  });

  it("should not render an error if categories cannot be fetched", async () => {
    simulateError("/categories");

    const { getCategoriesSkeleton, getCategoriesComboBox } =
      renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(getCategoriesComboBox()).not.toBeInTheDocument();
  });

  it("should render an error if products cannot be fetched", async () => {
    simulateError("/products");

    renderComponent();

    expect(
      await screen.findByText(/error/i)
    ).toBeInTheDocument();
  });

  it("should render categories", async () => {
    const { getCategoriesSkeleton, getCategoriesComboBox } =
      renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    const combobox = getCategoriesComboBox();
    expect(combobox).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(combobox!);

    expect(
      screen.getByRole("option", { name: /all/i })
    ).toBeInTheDocument();
    categories.forEach((category) => {
      expect(
        screen.getByRole("option", { name: category.name })
      ).toBeInTheDocument();
    });
  });

  it("should render products", async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it("should filter products by category", async () => {
    const { selectCategory, expectProductsToBeInTheDocument } =
      renderComponent();

    const selectedCategory = categories[0];
    await selectCategory(selectedCategory.name);

    const products = getProductsByCategory(selectedCategory.id);
    expectProductsToBeInTheDocument(products);
  });

  it("should render all products if All category is selected", async () => {
    const { selectCategory, expectProductsToBeInTheDocument } =
      renderComponent();

    await selectCategory(/all/i);

    const products = db.product.getAll();
    expectProductsToBeInTheDocument(products);
  });
});

