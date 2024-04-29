import { Table } from "@radix-ui/themes";
import axios from "axios";
import { useQuery } from "react-query";

import { Product } from "../entities";
import QuantitySelector from "./QuantitySelector";
import Skeleton from "./Skeleton";

interface Props {
  selectedCategoryId: number | undefined;
}

const ProductTable = ({ selectedCategoryId } : Props) => {

  const {data: products, isLoading, error} = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: async () => await axios.get<Product[]>("/products").then(res => res.data)
  })

  if (error) return <div>Error: {error.message}</div>;

  const visibleProducts = selectedCategoryId ? (
    products!.filter((p) => p.categoryId === selectedCategoryId)
  ) : (
    products
  );

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body
        role={isLoading ? "progressbar" : undefined}
        aria-label={isLoading ? "Loading products" : undefined}
      >
        {isLoading &&
          Array(5).fill(0).map((skeleton, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
            </Table.Row>
          ))}
        {!isLoading &&
          visibleProducts!.map((product) => (
            <Table.Row key={product.id}>
              <Table.Cell>{product.name}</Table.Cell>
              <Table.Cell>${product.price}</Table.Cell>
              <Table.Cell>
                <QuantitySelector product={product} />
              </Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table.Root>
  );
}

export default ProductTable