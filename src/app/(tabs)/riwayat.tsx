// src/app/(tabs)/riwayat.tsx
import { useState, useCallback } from "react";
import { View, Text, Button, Alert, Platform } from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import { KotaFavorit } from "../../../types/favorit";

export default function TabRiwayat() {
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);

  useFocusEffect(
    useCallback(() => {
      ambilSemuaFavorit().then(setDaftarFavorit);
    }, []),
  );

  // Menangani konfirmasi dan penghapusan kota favorit (kompatibel Mobile & Web)
  function hapus(id: number, nama: string) {
    const prosesHapus = async () => {
      await hapusFavorit(id);
      setDaftarFavorit((prev) => prev.filter((k) => k.id !== id));
    };

    if (Platform.OS === "web") {
      // Fallback untuk platform web karena react-native-web tidak mendukung Alert.alert()
      const konfirmasi = window.confirm(`Yakin hapus ${nama}?`);

      if (konfirmasi) {
        prosesHapus();
      }
    } else {
      // Sesuai ketentuan tugas: Alert.alert() untuk platform Android & iOS
      Alert.alert(`Yakin hapus ${nama}?`, "", [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Hapus",
          style: "destructive",
          onPress: prosesHapus,
        },
      ]);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Kota Favorit</Text>

      <Text>Tersimpan {daftarFavorit.length} kota</Text>

      {daftarFavorit.length === 0 && <Text>Belum ada kota favorit</Text>}

      {daftarFavorit.map((kota) => (
        <View
          key={kota.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text>{kota.nama}</Text>

          <Button title="Hapus" onPress={() => hapus(kota.id, kota.nama)} />
        </View>
      ))}
    </SafeAreaView>
  );
}
