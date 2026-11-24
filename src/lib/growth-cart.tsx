"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultConfig,
  type CartItem,
  getProduct,
} from "@/lib/growth-catalog";

const STORAGE_KEY = "siscom-growth-cart-v1";

export type ConsoleMode = "closed" | "config" | "checkout";

export type IspDetails = {
  name: string;
  reg: string;
  ca: string;
  county: string;
  subs: string;
  arpu: string;
  billing: string;
  channels: string;
  contact: string;
  email: string;
  phone: string;
  notes: string;
};

export type FinState = {
  access: boolean;
  want: boolean;
  amount: number;
};

export type TermsState = {
  wasp: boolean;
  deduct: boolean;
  data: boolean;
  accurate: boolean;
};

type GrowthCartContextValue = {
  cart: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updatePlan: (id: string, plan: string) => void;
  clearCart: () => void;
  mode: ConsoleMode;
  configProductId: string | null;
  checkoutStep: number;
  isp: IspDetails;
  fin: FinState;
  terms: TermsState;
  openConfig: (productId: string) => void;
  openCheckout: (opts?: { billing?: boolean }) => void;
  closeConsole: () => void;
  setCheckoutStep: (step: number) => void;
  setIsp: (patch: Partial<IspDetails>) => void;
  setFin: (patch: Partial<FinState>) => void;
  setTerms: (patch: Partial<TermsState>) => void;
  resetCheckout: () => void;
};

const blankIsp = (): IspDetails => ({
  name: "",
  reg: "",
  ca: "",
  county: "",
  subs: "",
  arpu: "1500",
  billing: "",
  channels: "",
  contact: "",
  email: "",
  phone: "",
  notes: "",
});

const blankFin = (): FinState => ({
  access: false,
  want: false,
  amount: 100_000,
});

const blankTerms = (): TermsState => ({
  wasp: false,
  deduct: false,
  data: false,
  accurate: false,
});

const GrowthCartContext = createContext<GrowthCartContextValue | null>(null);

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item?.productId && getProduct(item.productId));
  } catch {
    return [];
  }
}

export function GrowthCartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [mode, setMode] = useState<ConsoleMode>("closed");
  const [configProductId, setConfigProductId] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [isp, setIspState] = useState<IspDetails>(blankIsp);
  const [fin, setFinState] = useState<FinState>(blankFin);
  const [terms, setTermsState] = useState<TermsState>(blankTerms);

  useEffect(() => {
    setCart(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (mode === "closed") {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mode]);

  const addItem = useCallback((item: Omit<CartItem, "id">) => {
    setCart((prev) => [
      ...prev,
      { ...item, id: `${item.productId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` },
    ]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updatePlan = useCallback((id: string, plan: string) => {
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, plan } : c)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const openConfig = useCallback((productId: string) => {
    if (!getProduct(productId)) return;
    setConfigProductId(productId);
    setMode("config");
  }, []);

  const openCheckout = useCallback((opts?: { billing?: boolean }) => {
    setMode("checkout");
    setCheckoutStep(opts?.billing && cart.length === 0 ? 1 : 0);
    if (opts?.billing) {
      setFinState((f) => ({ ...f, want: true }));
    }
  }, [cart.length]);

  const closeConsole = useCallback(() => {
    setMode("closed");
    setConfigProductId(null);
  }, []);

  const setIsp = useCallback((patch: Partial<IspDetails>) => {
    setIspState((prev) => ({ ...prev, ...patch }));
  }, []);

  const setFin = useCallback((patch: Partial<FinState>) => {
    setFinState((prev) => ({ ...prev, ...patch }));
  }, []);

  const setTerms = useCallback((patch: Partial<TermsState>) => {
    setTermsState((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetCheckout = useCallback(() => {
    setCheckoutStep(0);
    setIspState(blankIsp());
    setFinState(blankFin());
    setTermsState(blankTerms());
    setConfigProductId(null);
  }, []);

  const value = useMemo(
    () => ({
      cart,
      addItem,
      removeItem,
      updatePlan,
      clearCart,
      mode,
      configProductId,
      checkoutStep,
      isp,
      fin,
      terms,
      openConfig,
      openCheckout,
      closeConsole,
      setCheckoutStep,
      setIsp,
      setFin,
      setTerms,
      resetCheckout,
    }),
    [
      cart,
      addItem,
      removeItem,
      updatePlan,
      clearCart,
      mode,
      configProductId,
      checkoutStep,
      isp,
      fin,
      terms,
      openConfig,
      openCheckout,
      closeConsole,
      setIsp,
      setFin,
      setTerms,
      resetCheckout,
    ],
  );

  return (
    <GrowthCartContext.Provider value={value}>
      {children}
    </GrowthCartContext.Provider>
  );
}

export function useGrowthCart() {
  const ctx = useContext(GrowthCartContext);
  if (!ctx) {
    throw new Error("useGrowthCart must be used within GrowthCartProvider");
  }
  return ctx;
}

export function useGrowthCartOptional() {
  return useContext(GrowthCartContext);
}

export { defaultConfig };
