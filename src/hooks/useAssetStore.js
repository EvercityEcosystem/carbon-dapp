import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAssetStore = create(
  persist(
    (set) => ({
      mode: "assetByData",
      data: {},
      setMode: (mode) => set(() => ({ mode })),
      setData: (data = {}) => set(() => ({ data })),
    }),
    {
      name: "assetStorage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useAssetStore;
