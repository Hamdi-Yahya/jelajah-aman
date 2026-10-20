// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ModeTema = "light" | "dark" | "system";

export interface PaletWarna {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  tint: string;
  inputBackground: string;
  inputBorder: string;
}

export const themes: Record<"light" | "dark", PaletWarna> = {
  light: {
    background: "#FFFFFF",
    card: "#F2F2F7",
    text: "#1C1C1E",
    textSecondary: "#8E8E93",
    border: "#E5E5EA",
    tint: "#208AEF",
    inputBackground: "#FFFFFF",
    inputBorder: "#C7C7CC",
  },
  dark: {
    background: "#121214",
    card: "#1C1C1E",
    text: "#F2F2F7",
    textSecondary: "#8E8E93",
    border: "#2C2C2E",
    tint: "#208AEF",
    inputBackground: "#1C1C1E",
    inputBorder: "#3A3A3C",
  },
};

interface ThemeContextType {
  modeTema: ModeTema;
  isDark: boolean;
  colors: PaletWarna;
  setModeTema: (mode: ModeTema) => Promise<void>;
}

const KUNCI_STORAGE_TEMA = "@jelajah_aman:mode_tema";

const ThemeContext = createContext<ThemeContextType>({
  modeTema: "system",
  isDark: false,
  colors: themes.light,
  setModeTema: async () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [modeTema, setModeTemaState] = useState<ModeTema>("system");

  // Memuat preferensi tema yang tersimpan saat inisialisasi aplikasi
  useEffect(() => {
    async function muatPreferensiTema() {
      try {
        const tersimpan = await AsyncStorage.getItem(KUNCI_STORAGE_TEMA);
        if (tersimpan === "light" || tersimpan === "dark" || tersimpan === "system") {
          setModeTemaState(tersimpan);
        }
      } catch (error) {
        console.error("Gagal memuat preferensi tema:", error);
      }
    }
    muatPreferensiTema();
  }, []);

  // Menyimpan dan menerapkan perubahan mode tema pengguna
  async function setModeTema(mode: ModeTema) {
    setModeTemaState(mode);
    try {
      await AsyncStorage.setItem(KUNCI_STORAGE_TEMA, mode);
    } catch (error) {
      console.error("Gagal menyimpan preferensi tema:", error);
    }
  }

  const isDark =
    modeTema === "dark" || (modeTema === "system" && systemScheme === "dark");

  const colors = isDark ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider value={{ modeTema, isDark, colors, setModeTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook khusus untuk mengakses tema dan warna di seluruh komponen layar
export function useAppTheme() {
  return useContext(ThemeContext);
}
