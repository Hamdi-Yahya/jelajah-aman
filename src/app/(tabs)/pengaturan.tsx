// src/app/(tabs)/pengaturan.tsx
import { useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme, ModeTema } from "../../context/ThemeContext";
import { hapusSemuaCache } from "../../services/cacheRepository";

export default function TabPengaturan() {
  const { modeTema, setModeTema, colors } = useAppTheme();
  const [pesan, setPesan] = useState<string | null>(null);

  // Menghapus seluruh data cuaca tersimpan
  async function hapusDataTersimpan() {
    await hapusSemuaCache();
    setPesan("Data cuaca tersimpan sudah dihapus.");
  }

  const opsiTema: { mode: ModeTema; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { mode: "light", label: "Terang", icon: "sunny-outline" },
    { mode: "dark", label: "Gelap", icon: "moon-outline" },
    { mode: "system", label: "Ikuti Sistem", icon: "phone-portrait-outline" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 20 }}>
        {/* BAGIAN 1: PENGATURAN TEMA (SOAL NO. 4) */}
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="color-palette-outline" size={20} color={colors.tint} />
            <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.text }}>
              Mode Tampilan
            </Text>
          </View>

          <Text style={{ fontSize: 13, color: colors.textSecondary }}>
            Pilih tema tampilan aplikasi sesuai preferensi Anda.
          </Text>

          <View style={{ gap: 8 }}>
            {opsiTema.map((opsi) => {
              const isActive = modeTema === opsi.mode;
              return (
                <TouchableOpacity
                  key={opsi.mode}
                  onPress={() => setModeTema(opsi.mode)}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    backgroundColor: colors.card,
                    borderRadius: 8,
                    borderWidth: isActive ? 2 : 1,
                    borderColor: isActive ? colors.tint : colors.border,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons
                      name={opsi.icon}
                      size={20}
                      color={isActive ? colors.tint : colors.textSecondary}
                    />
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: isActive ? "600" : "normal",
                        color: isActive ? colors.tint : colors.text,
                      }}
                    >
                      {opsi.label}
                    </Text>
                  </View>

                  {isActive && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.tint} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* BAGIAN 2: INFORMASI DAN DATA APLIKASI */}
        <View style={{ gap: 10, marginTop: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="information-circle-outline" size={20} color={colors.tint} />
            <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.text }}>
              Informasi Aplikasi
            </Text>
          </View>

          <View
            style={{
              padding: 12,
              backgroundColor: colors.card,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border,
              gap: 4,
            }}
          >
            <Text style={{ fontWeight: "600", color: colors.text }}>Jelajah Aman</Text>
            <Text style={{ fontSize: 13, color: colors.textSecondary }}>Versi 1.0.0</Text>
          </View>

          <Button
            title="Hapus Seluruh Data Cuaca Tersimpan"
            color="#FF3B30"
            onPress={hapusDataTersimpan}
          />

          {pesan && (
            <Text
              accessibilityLabel={pesan}
              style={{ color: "#34C759", textAlign: "center", marginTop: 4 }}
            >
              {pesan}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
