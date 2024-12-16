import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

import { StorageEnum, ThemeMode } from "@/types";
import { getItem, setItem } from "@/src/lib/utils";
import { colorPrimarys } from "@/theme/antd/theme";

type SettingType = {
  themeColor: string;
  themeMode: ThemeMode;
};

interface SettingData {
  settings: SettingType;
  setSettings: (settings: SettingType) => void;
}

export const useSettingStore = create<SettingData>((set) => ({
  settings: {
    themeColor:
      Object.values(colorPrimarys)[Object.values(colorPrimarys).length - 1],
    themeMode: ThemeMode.Dark,
  },
  setSettings: (settings) => {
    set({ settings });
    setItem(StorageEnum.Settings, settings);
    Cookies.set(StorageEnum.Settings, JSON.stringify(settings), { expires: 7 });
  },
}));
