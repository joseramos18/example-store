import { parseCurrency } from "@/utils/currency";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  Divider,
  Button,
  DrawerFooter,
  DrawerProps,
  Text,
  Link,
} from "@chakra-ui/react";
import React, { FC, useEffect, useMemo } from "react";
import { CartItem, Product } from "../types";

interface Props extends Omit<DrawerProps, "children"> {
  items: CartItem[];
  onIncrement: (product: Product) => void;
  onDecrement: (product: Product) => void;
}

const CartDrawer: FC<Props> = ({
  items,
  onDecrement,
  onIncrement,
  onClose,
  ...props
}) => {
  const total = useMemo(
    () =>
      parseCurrency(
        items.reduce(
          (total, product) => total + product.price * product.quantity,
          0
        )
      ),
    [items]
  );
  const text = useMemo(() => {
    return items
      .reduce(
        (message, product) =>
          message.concat(
            `* ${product.title}${
              product.quantity > 1 ? `(X${product.quantity})` : ""
            } - ${parseCurrency(product.price * product.quantity)}\n`
          ),
        ``
      )
      .concat(`\nTotal: ${total}`);
  }, [items, total]);

  useEffect(() => {
    if (!items.length) {
      onClose();
    }
  }, [items.length, onClose]);

  return (
    <Drawer placement="right" size="sm" onClose={onClose} {...props}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Tu pedido</DrawerHeader>
        <DrawerBody>
          <Stack spacing={4} divider={<Divider />}>
            {items.map((product) => (
              <Stack direction={"row"} key={product.id}>
                <Stack width={"100%"}>
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Text fontWeight={500}>{product.title} </Text>
                    <Text color={"green.400"}>
                      {parseCurrency(product.price * product.quantity)}
                    </Text>
                  </Stack>
                  <Stack direction={"row"}>
                    <Button onClick={() => onDecrement(product)} size={"xs"}>
                      {" "}
                      -{" "}
                    </Button>
                    <Text>{product.quantity}</Text>
                    <Button onClick={() => onIncrement(product)} size={"xs"}>
                      {" "}
                      +{" "}
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </DrawerBody>
        <DrawerFooter>
          <Button
            as={Link}
            colorScheme="whatsapp"
            isExternal
            href={`https://wa.me/5491169832977?text=${encodeURIComponent(
              text
            )}`}
            size="lg"
            width="100%"
          >
            Completar pedido {total}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
export default CartDrawer;
