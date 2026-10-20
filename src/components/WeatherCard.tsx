// src/components/WeatherCard.tsx
import { View, Text } from "react-native";
import { WeatherCardProps, TingkatAQI } from "../../types/cuaca";
import { typeScale, spacing } from "../constants/styles";
import { useAppTheme } from "../context/ThemeContext";

const warnaPerTingkat: Record<TingkatAQI, string> = {
  BAIK: "#34C759",
  SEDANG: "#FFCC00",
  TIDAK_SEHAT: "#FF9500",
  BERBAHAYA: "#FF3B30",
};

export default function WeatherCard({
  kota,
  suhu,
  tingkatAQI,
  indeksAQI,
}: WeatherCardProps) {
  const { colors } = useAppTheme();

  const teksAQI =
    indeksAQI !== undefined
      ? `AQI: ${indeksAQI} (${tingkatAQI})`
      : `AQI: ${tingkatAQI}`;
  const labelAksesibilitas =
    indeksAQI !== undefined
      ? `Cuaca ${kota}, suhu ${suhu} derajat, indeks kualitas udara ${indeksAQI}, kategori ${tingkatAQI}`
      : `Cuaca ${kota}, suhu ${suhu} derajat, kualitas udara ${tingkatAQI}`;

  return (
    <View
      accessible
      accessibilityLabel={labelAksesibilitas}
      style={{
        padding: spacing.sedang,
        borderRadius: 8,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: typeScale.judul, color: colors.text }}>
        {kota}
      </Text>
      <Text style={{ fontSize: 32, fontWeight: "600", color: colors.text }}>
        {suhu}°C
      </Text>
      <Text
        style={{ color: warnaPerTingkat[tingkatAQI], fontSize: typeScale.isi, fontWeight: "500" }}
      >
        {teksAQI}
      </Text>
    </View>
  );
}
