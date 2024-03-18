"use client";

import { ProductType } from "@/types/types";
import { useCartStore } from "@/utils/store";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

// カートに追加される商品の値段を決定するコンポーネント
// 追加数に応じた合計金額の計算など行っている
const Price = ({ product }: {product: ProductType}) => {
  // 値段の合計
  const [total, setTotal] = useState(product.price);
  // 商品数の合計
  const [quantity, setQuantity] = useState(1);
  // optional配列の先頭をデフォルト選択
  const [selected, setSelected] = useState(0);

  const {addToCart} = useCartStore();

  // useEffect(() => {
  //   useCartStore.persist.rehydrate();
  // },[])

  useEffect(() => {
    setTotal(
      quantity * product.price + (product.options?.[selected]?.additionalPrice ?? 0)
    );
  }, [quantity, selected, product]);

  const handleCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      img: product.img,
      price: total,
      ...(product.options?.length && {
        optionTitle: product.options[selected].title,
      }),
      quantity: quantity,
    });
    toast.success('The product add to the cart!');
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">${total}</h2>
      {/* OPTIONS CONTAINER */}
      <div className="flex gap-4">
        {!!product.options?.length && product.options?.map((option, index) => (
          <button
            key={option.title}
            className="min-w-[6rem] p-2 ring-1 ring-red-400 rounded-md"
            style={{
              background: selected === index ? "rgb(248 113 113)" : "white",
              color: selected === index ? "white" : "red",
            }}
            onClick={() => setSelected(index)}
          >
            {option.title}
          </button>
        ))}
      </div>
      {/* QUANTITY AND ADD BUTTON CONTAINER */}
      <div className="flex justify-between items-center">
        {/* QUANTITY */}
        <div className="flex justify-between w-full p-3 ring-1 ring-red-500">
          <span>Quantity</span>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
            >
              {"<"}
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => (prev < 9 ? prev + 1 : 9))}
            >
              {">"}
            </button>
          </div>
        </div>
        {/* CART BUTTON */}
        <button className="uppercase w-56 bg-red-500 text-white p-3 ring-1 ring-red-500" onClick={handleCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Price;
