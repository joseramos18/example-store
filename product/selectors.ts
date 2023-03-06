import { CartItem, Product } from "./types";

export function edcitCart(product: Product, action: "increment" | "decrement") {
  return (cart: CartItem[]): CartItem[] => {
    const isInCart = cart.some((item) => item.id === product.id);
    if (!isInCart) {
      return cart.concat({ ...product, quantity: 1 });
    }

    return cart.reduce((acc: CartItem[], _product: CartItem) => {
      if (product.id !== _product.id) {
        return acc.concat(_product);
      }
      let quantity = _product.quantity;
      if (action === "decrement") {
        if (_product.quantity === 1) {
          return acc;
        }
        quantity = quantity - 1;
      } else if (action === "increment") {
        quantity = quantity + 1;
      }
      return acc.concat({ ..._product, quantity: quantity });
    }, []);
  };
}
