"use client"

import { useCartStore } from "@/utils/store";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const payment_intent = searchParams.get('payment_intent');
  const router = useRouter();
  const { clearCart } = useCartStore();

  useEffect(() => {
    const makeRequest = async () => {
      try {
        await fetch(`http://localhost:3000/api/confirm/${payment_intent}`, {
          method: "PUT",
        });
        clearCart();
        router.push("/orders");
      } catch(error) {
        console.error(error);
      }
    };

    makeRequest();
  },[payment_intent, router, clearCart]);

  return (
    <div>
      Payment successful. You are being redirected to the orders page. Please do not close the page.
    </div>
  )
}

export default SuccessPage