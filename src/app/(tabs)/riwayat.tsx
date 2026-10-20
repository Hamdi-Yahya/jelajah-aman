// src/app/(tabs)/riwayat.tsx
import { useState, useCallback } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../context/ThemeContext";
import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import {
  ambilRiwayatPencarian,
  hapusSatuRiwayatPencarian,
} from "../../services/riwayatPencarianStorage";
import {
  daftarKotaTersimpan,
  hapusCacheKota,
} from "../../services/cacheRepository";
import { KotaFavorit } from "../../../types/favorit";
import { HasilGeocoding } from "../../../types/geocoding";
import { RingkasanKotaTersimpan } from "../../../types/cache";

export default function TabRiwayat() {
  const { colors } = useAppTheme();
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);
  const [daftarRiwayat, setDaftarRiwayat] = useState<HasilGeocoding[]>([]);
  const [daftarCache, setDaftarCache] = useState<RingkasanKotaTersimpan[]>([]);

  // Memuat data favorit, riwayat pencarian, dan cache offline setiap kali tab difokuskan
  useFocusEffect(
    useCallback(() => {
      ambilSemuaFavorit().then(setDaftarFavorit);
      ambilRiwayatPencarian().then(setDaftarRiwayat);
      daftarKotaTersimpan().then(setDaftarCache);
    }, []),
  );

  // Menangani klik item riwayat untuk otomatis membuka pencarian kota di Beranda
  function bukaRiwayatKota(kota: HasilGeocoding) {
    router.push({
      pathname: "/",
      params: {
        pilihKotaId: String(kota.id),
        nama: kota.name,
        lat: String(kota.latitude),
        lon: String(kota.longitude),
        country: kota.country,
      },
    });
  }

  // Menghapus satu item dari riwayat pencarian
  async function hapusRiwayat(id: number) {
    await hapusSatuRiwayatPencarian(id);
    setDaftarRiwayat((prev) => prev.filter((k) => k.id !== id));
  }

  // Menangani konfirmasi (Alert) dan penghapusan data cache kota offline (Soal No. 3)
  function konfirmasiHapusCache(kunci: string, nama: string) {
    const prosesHapus = async () => {
      await hapusCacheKota(kunci);
      setDaftarCache((prev) => prev.filter((k) => k.kunci !== kunci));
    };

    if (Platform.OS === "web") {
      const konfirmasi = window.confirm(
        `Apakah Anda yakin ingin menghapus data cache offline untuk kota ${nama}?`,
      );
      if (konfirmasi) prosesHapus();
    } else {
      Alert.alert(
        "Hapus Cache Kota",
        `Apakah Anda yakin ingin menghapus data cache offline untuk kota ${nama}?`,
        [
          { text: "Batal", style: "cancel" },
          { text: "Hapus", style: "destructive", onPress: prosesHapus },
        ],
      );
    }
  }

  // Menangani konfirmasi dan penghapusan kota favorit (kompatibel Mobile & Web)
  function hapus(id: number, nama: string) {
    const prosesHapus = async () => {
      await hapusFavorit(id);
      setDaftarFavorit((prev) => prev.filter((k) => k.id !== id));
    };

    if (Platform.OS === "web") {
      const konfirmasi = window.confirm(`Yakin hapus ${nama}?`);
      if (konfirmasi) prosesHapus();
    } else {
      Alert.alert(`Yakin hapus ${nama}?`, "", [
        { text: "Batal", style: "cancel" },
        { text: "Hapus", style: "destructive", onPress: prosesHapus },
      ]);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }}>
        {/* BAGIAN 1: RIWAYAT PENCARIAN TERAKHIR (SOAL NO. 2) */}
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="time-outline" size={20} color={colors.tint} />
            <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.text }}>
              Riwayat Pencarian Terakhir
            </Text>
          </View>

          {daftarRiwayat.length === 0 ? (
            <Text style={{ color: colors.textSecondary }}>Belum ada riwayat pencarian</Text>
          ) : (
            daftarRiwayat.map((kota) => (
              <View
                key={kota.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  backgroundColor: colors.card,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => bukaRiwayatKota(kota)}
                >
                  <Text style={{ fontWeight: "600", fontSize: 15, color: colors.text }}>
                    {kota.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                    {kota.country} {kota.admin1 ? `• ${kota.admin1}` : ""}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => hapusRiwayat(kota.id)}
                  style={{ padding: 4 }}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* BAGIAN 2: CACHE KOTA TERSIMPAN / OFFLINE (SOAL NO. 3) */}
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="cloud-offline-outline" size={20} color={colors.tint} />
            <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.text }}>
              Cache Kota Tersimpan (Offline)
            </Text>
          </View>

          <Text style={{ fontSize: 12, color: colors.textSecondary }}>
            Tersimpan di database lokal ({daftarCache.length} kota)
          </Text>

          {daftarCache.length === 0 ? (
            <Text style={{ color: colors.textSecondary }}>Belum ada data cache tersimpan</Text>
          ) : (
            daftarCache.map((kota) => (
              <View
                key={kota.kunci}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  backgroundColor: colors.card,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() =>
                    router.push({
                      pathname: "/",
                      params: {
                        pilihKotaId: String(kota.id),
                        nama: kota.nama,
                        lat: String(kota.latitude),
                        lon: String(kota.longitude),
                        country: "",
                      },
                    })
                  }
                >
                  <Text style={{ fontWeight: "600", fontSize: 15, color: colors.text }}>
                    {kota.nama}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                    Disimpan:{" "}
                    {new Date(kota.disimpanPada).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </TouchableOpacity>

                <Button
                  title="Hapus Cache"
                  color="#FF3B30"
                  onPress={() => konfirmasiHapusCache(kota.kunci, kota.nama)}
                />
              </View>
            ))
          )}
        </View>

        {/* BAGIAN 3: DAFTAR KOTA FAVORIT */}
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="bookmark-outline" size={20} color={colors.tint} />
            <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.text }}>
              Kota Favorit
            </Text>
          </View>

          <Text style={{ fontSize: 12, color: colors.textSecondary }}>
            Tersimpan {daftarFavorit.length} kota
          </Text>

          {daftarFavorit.length === 0 && (
            <Text style={{ color: colors.textSecondary }}>Belum ada kota favorit</Text>
          )}

          {daftarFavorit.map((kota) => (
            <View
              key={kota.id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text style={{ fontSize: 15, color: colors.text }}>{kota.nama}</Text>
              <Button title="Hapus" onPress={() => hapus(kota.id, kota.nama)} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
