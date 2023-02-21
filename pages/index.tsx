import api from "@/product/api";
import { Product } from "@/product/types";
import { GetStaticProps } from "next";
import { FC, useMemo, useState } from "react";
import { Box, Button, Flex, Grid, Link, Stack, Text } from "@chakra-ui/react";

interface Props {
  products: Product[];
}

function parseCurrency(value: number): string {
  return value.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
}

const Home: FC<Props> = ({ products }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const text = useMemo(() => {
    return cart
      .reduce(
        (message, product) =>
          message.concat(
            `* ${product.title} - ${parseCurrency(product.price)}\n`
          ),
        ``
      )
      .concat(
        `\nTotal: ${parseCurrency(
          cart.reduce((total, product) => total + product.price, 0)
        )}`
      );
  }, [cart]);

  return (
    <Stack spacing={6}>
      <Grid gridGap={6} templateColumns="repeat(auto-fill, minmax(240px, 1fr))">
        {products.map((product) => (
          <Stack
            borderRadius="md"
            padding={4}
            key={product.id}
            backgroundColor="gray.100"
            spacing={3}
          >
            <Stack spacing={1}>
              <Text>{product.title}</Text>
              <Text fontSize="sm" fontWeight="500" color="green.500">
                {parseCurrency(product.price)}
              </Text>
            </Stack>

            <Button
              onClick={() => setCart((cart) => cart.concat(product))}
              colorScheme="primary"
              variant="outline"
              size="sm"
            >
              Agregar
            </Button>
          </Stack>
        ))}
      </Grid>
      {Boolean(cart.length) && (
        <Flex
          padding={4}
          alignItems="center"
          justifyContent="center"
          position="sticky"
          bottom={4}
        >
          <Button
            as={Link}
            colorScheme="whatsapp"
            isExternal
            href={`https://wa.me/5491169832977?text=${encodeURIComponent(
              text
            )}`}
          >
            Completar pedido ({cart.length}) productos
          </Button>
        </Flex>
      )}
    </Stack>
  );
};

// GetServerSideProps
export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();
  return {
    revalidate: 10,
    props: {
      products,
    },
  };
};

export default Home;
