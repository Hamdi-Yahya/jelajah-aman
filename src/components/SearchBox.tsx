// src/components/SearchBox.tsx
import { useState } from "react";
import { View, TextInput } from "react-native";
import { useAppTheme } from "../context/ThemeContext";

interface SearchBoxProps {
  onCari: (teks: string) => void;
}

export default function SearchBox({ onCari }: SearchBoxProps) {
  const { colors } = useAppTheme();
  const [teks, setTeks] = useState("");

  function handleChange(nilaiBaru: string) {
    setTeks(nilaiBaru);
    onCari(nilaiBaru); // kirim setiap perubahan, debounce diatur di pemanggilnya
  }

  return (
    <View>
      <TextInput
        placeholder="Cari nama kota..."
        placeholderTextColor={colors.textSecondary}
        value={teks}
        onChangeText={handleChange}
        accessibilityLabel="Cari cuaca untuk kota yang dimasukkan"
        style={{
          borderWidth: 1,
          borderColor: colors.inputBorder,
          backgroundColor: colors.inputBackground,
          color: colors.text,
          padding: 10,
          borderRadius: 8,
        }}
      />
    </View>
  );
}
