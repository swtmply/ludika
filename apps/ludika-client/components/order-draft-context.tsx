import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/** A point on the map chosen as an Order's pickup or drop-off. See CONTEXT.md. */
export type Pin = {
  label: string;
  latitude: number | null;
  longitude: number | null;
};

/** One thing carried under an Order. See CONTEXT.md. */
export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  note: string;
};

export type OrderDraft = {
  pickup: Pin | null;
  dropoff: Pin | null;
  contactName: string;
  contactPhone: string;
  notes: string;
  items: OrderItem[];
};

const EMPTY_DRAFT: OrderDraft = {
  pickup: null,
  dropoff: null,
  contactName: "",
  contactPhone: "",
  notes: "",
  items: [],
};

type OrderDraftContextType = {
  draft: OrderDraft;
  /** One patch function rather than a setter per field: the field list will churn
   *  once the Order schema lands, and this signature does not churn with it. */
  update: (patch: Partial<OrderDraft>) => void;
  reset: () => void;
};

const OrderDraftContext = createContext<OrderDraftContextType | undefined>(undefined);

export const OrderDraftProvider = ({ children }: { children: ReactNode }) => {
  const [draft, setDraft] = useState<OrderDraft>(EMPTY_DRAFT);

  const update = useCallback((patch: Partial<OrderDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setDraft(EMPTY_DRAFT);
  }, []);

  const value = useMemo(() => ({ draft, update, reset }), [draft, update, reset]);

  return <OrderDraftContext.Provider value={value}>{children}</OrderDraftContext.Provider>;
};

export function useOrderDraft() {
  const context = useContext(OrderDraftContext);
  if (!context) {
    throw new Error("useOrderDraft must be used within OrderDraftProvider");
  }
  return context;
}
