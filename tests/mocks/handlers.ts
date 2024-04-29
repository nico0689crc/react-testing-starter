import { db } from "./db";
// import { http, HttpResponse } from "msw";
// import { categories, products } from "./data";

export const handlers = [
  ...db.product.toHandlers('rest'),
  ...db.category.toHandlers('rest'),
];

// export const handlers = [
//   http.get('/categories', () => HttpResponse.json(categories)),

//   http.get('/products', () => HttpResponse.json(products)),

//   http.get('/products/:id', ({ params }) => {
//     const id = parseInt(params.id as string);
//     const product = products.find(product => product.id === id);

//     if (!product) {
//       return HttpResponse.json(null, { status: 404 })
//     }

//     return HttpResponse.json(product);
//   }),
// ];

