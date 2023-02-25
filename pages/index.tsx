import api from "@/product/api";
import { Product } from "@/product/types";
import { GetStaticProps } from "next";
import { FC, useMemo, useState } from "react";
import { Button, Flex, Grid, Image, Link, Stack, Text } from "@chakra-ui/react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";

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
  const [selectedImage, setSelectedImage] = useState<string>("");
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
    <>
      <Stack spacing={6}>
        <Grid
          gridGap={6}
          templateColumns="repeat(auto-fill, minmax(240px, 1fr))"
        >
          {products.map((product) => (
            <Stack
              borderRadius="md"
              padding={4}
              key={product.id}
              backgroundColor="gray.100"
              spacing={3}
            >
              <Stack spacing={1}>
                <Image
                  alt={product.title}
                  as={motion.img}
                  cursor={"pointer"}
                  layoutId={product.image}
                  maxHeight={128}
                  objectFit="cover"
                  borderTopRadius={"md"}
                  src={product.image}
                  onClick={() => setSelectedImage(product.image)}
                />
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
        <AnimatePresence>
          {Boolean(cart.length) && (
            <Flex
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              padding={4}
              alignItems="center"
              as={motion.div}
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
                leftIcon={<Image src="https://icongr.am/fontawesome/whatsapp.svg?size=32&color=ffffff"/>}
              >
                Completar pedido ({cart.length}) productos
              </Button>
            </Flex>
          )}
        </AnimatePresence>
      </Stack>
      <AnimatePresence>
        {selectedImage != "" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage("")}
          >
            <Flex
              key={"backdrop"}
              alignItems="center"
              backgroundColor={"rgba(0,0,0,0.5)"}
              justifyContent="center"
              position="fixed"
              top={0}
              left={0}
              height="100%"
              width="100%"
            >
              <Image key={"image"} src={selectedImage}></Image>
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
