export type WcBiz = {
  name: string;
  ca: string;
  contact: string;
  phone: string;
  email: string;
  county: string;
};

export const WC_BIZ_STORAGE_KEY = "siscom-wc-biz-v1";

export function blankWcBiz(): WcBiz {
  return {
    name: "",
    ca: "",
    contact: "",
    phone: "",
    email: "",
    county: "",
  };
}

export function loadWcBiz(): WcBiz {
  if (typeof window === "undefined") return blankWcBiz();
  try {
    const raw = sessionStorage.getItem(WC_BIZ_STORAGE_KEY);
    if (!raw) return blankWcBiz();
    const parsed = JSON.parse(raw) as Partial<WcBiz>;
    return { ...blankWcBiz(), ...parsed };
  } catch {
    return blankWcBiz();
  }
}

export function saveWcBiz(biz: WcBiz) {
  try {
    sessionStorage.setItem(WC_BIZ_STORAGE_KEY, JSON.stringify(biz));
  } catch {
    /* ignore */
  }
}
