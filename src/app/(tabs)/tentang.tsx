// app/(tabs)/tentang.tsx
import { Text, View } from "react-native";
import { typeScale, spacing } from "../../constants/styles";

export default function Tentang() {
  return (
    <View style={{ padding: spacing.sedang }}>
      <Text
        accessibilityLabel="Nama aplikasi Jelajah Aman"
        style={{
          fontSize: typeScale.judul,
          fontWeight: "bold",
        }}
      >
        Jelajah Aman
      </Text>

      <Text style={{ fontSize: typeScale.isi }}>
        Versi 1.0.0
      </Text>

      <Text style={{ fontSize: typeScale.keterangan }}>
        Pembuat: Muhammad Hamdi Yahya
      </Text>
    </View>
  );
}