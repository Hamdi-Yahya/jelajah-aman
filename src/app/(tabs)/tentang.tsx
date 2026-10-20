// app/(tabs)/tentang.tsx
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typeScale, spacing } from "../../constants/styles";
import { useAppTheme } from "../../context/ThemeContext";

export default function Tentang() {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, padding: spacing.sedang }}>
      <View style={{ gap: 8 }}>
        <Text
          accessibilityLabel="Nama aplikasi Jelajah Aman"
          style={{
            fontSize: typeScale.judul,
            fontWeight: "bold",
            color: colors.text,
          }}
        >
          Jelajah Aman
        </Text>

        <Text style={{ fontSize: typeScale.isi, color: colors.textSecondary }}>
          Versi 1.0.0
        </Text>

        <Text style={{ fontSize: typeScale.keterangan, color: colors.textSecondary }}>
          Pembuat: Muhammad Hamdi Yahya
        </Text>
      </View>
    </SafeAreaView>
  );
}