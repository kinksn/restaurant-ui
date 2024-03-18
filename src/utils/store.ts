import { ActionTypes, CartType } from "@/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// カートに商品が無い時のステータス
const INITIAL_STATE = {
  products: [],
  totalItems: 0,
  totalPrice: 0,
};

// カートの状態を管理するstore
// itemが追加された商品で、productがstoreの最新の商品
export const useCartStore = create(persist<CartType & ActionTypes>((set, get) => ({
  products: INITIAL_STATE.products,
  totalItems: INITIAL_STATE.totalItems,
  totalPrice: INITIAL_STATE.totalPrice, 
  addToCart(item) {
    // 現在のstoreの`products`fieldを取得（`cart`をキーにしてlocalStrageからデータ取得）
    const products = get().products;
    // itemが現在のstore.productsに存在するかチェック
    const productInState = products.find((product) => product.id === item.id);

    // itemがstore.productに存在していればアップデート
    if (productInState) {
      const updatedProducts = products.map((product) =>
        product.id === productInState.id
          ? {
            ...item,
            quantity: item.quantity + product.quantity,
            price: item.price + product.price,
          }
          : item
      );
      set((state) => ({
        products: updatedProducts,
        totalItems: state.totalItems + item.quantity,
        totalPrice: state.totalPrice + item.price,
      }))
    // itemがstore.productになければ追加登録
    } else {
      set((state) => ({
        products: [...state.products, item],
        totalItems: state.totalItems + item.quantity,
        totalPrice: state.totalPrice + item.price,
      }));
    }
  },
  removeFromCart(item) {
    set((state) => {
      console.log(`state.products.filter((product) => product.id !== item.id): ${state.products.filter((product) => product.id !== item.id)}`);
      console.log(`state.totalItems: ${state.totalItems}, item.quantity: ${item.quantity}`);
      console.log(`state.totalPrice: ${state.totalPrice}, item.price: ${item.price}`);
      return {
        products: state.products.filter((product) => product.id !== item.id), // カートに追加された商品以外を残す
        totalItems: state.totalItems - item.quantity,
        totalPrice: state.totalPrice - item.price,
      }
    });
  },
  // persist関数を使ってlocalStrageに"cart"というキーで保存している
}), {name: "cart", skipHydration: true }));