import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { useEffect } from "react";
import { SingleEnrollment } from "./useEnrollments";

interface ShoppingCartStore {
  items: SingleEnrollment[];
  setCart: (items: SingleEnrollment[]) => void;
  coupons: string[];
  setCoupons: (coupons: string[]) => void;
}

const useShoppingCartStore = create<ShoppingCartStore>((set) => ({
  items: [],
  setCart: (items: SingleEnrollment[]) => {
    set(() => ({ items: [...items] }));
  },
  coupons: [],
  setCoupons: (coupons: string[]) => {
    set(() => ({ coupons: [...coupons] }));
  },
}));

if (process.env.NODE_ENV === "development")
  mountStoreDevtool("Shopping cart store", useShoppingCartStore);

const useShoppingCart = () => {
  const { items, setCart, coupons, setCoupons: setStoreCoupons } = useShoppingCartStore();

  useEffect(() => {
    const storedCart = localStorage.getItem("shoppingCart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    } else {
      localStorage.setItem("shoppingCart", JSON.stringify([]));
    }

    const storedCoupons = localStorage.getItem("coupons");
    if (storedCoupons) {
      setStoreCoupons(JSON.parse(storedCoupons));
    } else {
      localStorage.setItem("coupons", JSON.stringify([]));
    }
  }, []);

  const addItem = (item: SingleEnrollment) => {
    console.log(item);
    const storedItemsStr = localStorage.getItem("shoppingCart") || "[]";
    const storedItems: SingleEnrollment[] = JSON.parse(storedItemsStr);
    const alreadyThere = storedItems.find(
      (i) => i.camp_id === item.camp_id && i.student_id === item.student_id
    );
    if (alreadyThere) return;
    const newItems = [...storedItems, item];
    localStorage.setItem("shoppingCart", JSON.stringify(newItems));
    setCart(newItems);
  };

  const removeItem = (item: SingleEnrollment) => {
    const storedItemsStr = localStorage.getItem("shoppingCart") || "[]";
    const storedItems: SingleEnrollment[] = JSON.parse(storedItemsStr);
    const newItems = storedItems.filter(
      (i) => i.camp_id !== item.camp_id || i.student_id !== item.student_id
    );
    localStorage.setItem("shoppingCart", JSON.stringify(newItems));
    setCart(newItems);
  };

  const clearCart = () => {
    localStorage.setItem("shoppingCart", JSON.stringify([]));
    setCart([]);
  };

  const setCoupons = (coupons: string[]) => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
    setStoreCoupons(coupons);
  };


  return { items, addItem, removeItem, clearCart, coupons, setCoupons };
};

export default useShoppingCart;
