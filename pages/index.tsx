import api from "@/product/api";
import { CartItem, Product } from "@/product/types";
import { GetStaticProps } from "next";
import { FC, useState } from "react";
import { Button, Flex, Grid, Image, Stack, Text } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import CartDrawer from "@/product/components/CartDrawer";
import { parseCurrency } from "@/utils/currency";
import { edcitCart } from "@/product/selectors";

interface Props {
  products: Product[];
}

const Home: FC<Props> = ({ products }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isCartOpen, toggleCart] = useState<boolean>(false);
  function handleEditCart(product: Product, action: "increment" | "decrement") {
    setCart(edcitCart(product, action));
  }
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
              boxShadow={"md"}
              borderWidth={1}
              borderColor={"gary.100"}
              padding={4}
              key={product.id}
              backgroundColor="gray.100"
              spacing={3}
            >
              <Stack direction={"row"}>
                <Image
                  loading="lazy"
                  backgroundColor={"white"}
                  borderRadius={"md"}
                  height={16}
                  objectFit="contain"
                  width={16}
                  alt={product.title}
                  as={motion.img}
                  cursor={"pointer"}
                  layoutId={product.image}
                  maxHeight={128}
                  src={product.image}
                  onClick={() => setSelectedImage(product.image)}
                />
                <Stack spacing={1}>
                  <Text>{product.title}</Text>
                  <Text fontSize="sm" fontWeight="500" color="green.500">
                    {parseCurrency(product.price)}
                  </Text>
                </Stack>
              </Stack>
              <Button
                onClick={() => handleEditCart(product, "increment")}
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
                size={"lg"}
                onClick={() => toggleCart(true)}
                colorScheme="whatsapp"
              >
                Ver pedido ({cart.reduce((acc, item) => acc + item.quantity, 0)}
                ) productos
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
      <CartDrawer
        items={cart}
        onIncrement={(product) => handleEditCart(product, "increment")}
        onDecrement={(product) => handleEditCart(product, "decrement")}
        isOpen={isCartOpen}
        onClose={() => toggleCart(false)}
      />
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
