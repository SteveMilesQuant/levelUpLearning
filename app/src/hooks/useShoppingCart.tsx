import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { useEffect } from "react";
import { CampQuery, useCamps } from "../camps";
import { SingleEnrollment } from "./useEnrollment";

interface ShoppingCartStore {
  items: SingleEnrollment[];
  totalCost: number;
  setCart: (items: SingleEnrollment[]) => void;
  setTotalCost: (totalCost: number) => void;
}

const useShoppingCartStore = create<ShoppingCartStore>((set) => ({
  items: [],
  totalCost: 0,
  setCart: (items: SingleEnrollment[]) => {
    set(() => ({ items: [...items] }));
  },
  setTotalCost: (totalCost: number) => set(() => ({ totalCost })),
}));

if (process.env.NODE_ENV === "development")
  mountStoreDevtool("Shopping cart store", useShoppingCartStore);

const useShoppingCart = () => {
  const { items, setCart, totalCost, setTotalCost } = useShoppingCartStore();
  const { data: camps } = useCamps({ is_published: true } as CampQuery, false);

  useEffect(() => {
    const storedCart = localStorage.getItem("shoppingCart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    } else {
      localStorage.setItem("shoppingCart", JSON.stringify([]));
    }
  }, []);

  useEffect(() => {
    let tally = 0;
    if (camps) {
      items.forEach((item) => {
        const camp = camps.find((c) => c.id === item.camp_id);
        if (!camp) return;
        tally = tally + (camp.cost || 0);
      });
    }
    setTotalCost(tally);
  }, [items, camps]);

  const addItem = (item: SingleEnrollment) => {
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

  return { items, totalCost, addItem, removeItem, clearCart };
};

export default useShoppingCart;
