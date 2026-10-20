// src/services/riwayatPencarianStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HasilGeocoding } from "../../types/geocoding";

const KUNCI_RIWAYAT = "@jelajah_aman:riwayat_pencarian";
const MAKSIMAL_RIWAYAT = 10;

// Mengambil seluruh riwayat pencarian yang tersimpan
export async function ambilRiwayatPencarian(): Promise<HasilGeocoding[]> {
  try {
    const json = await AsyncStorage.getItem(KUNCI_RIWAYAT);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

// Menyimpan kota ke daftar riwayat pencarian terakhir (maksimal 10 item)
export async function simpanRiwayatPencarian(kota: HasilGeocoding): Promise<void> {
  // Abaikan lokasi GPS otomatis (id: -1) dari daftar riwayat
  if (kota.id === -1) return;

  try {
    const daftarLama = await ambilRiwayatPencarian();
    // Hilangkan duplikasi kota jika sudah ada sebelumnya agar pindah ke urutan teratas
    const daftarTanpaDuplikat = daftarLama.filter((item) => item.id !== kota.id);

    // Tempatkan item terbaru di awal array dan batasi maksimal 10 entri
    const daftarBaru = [kota, ...daftarTanpaDuplikat].slice(0, MAKSIMAL_RIWAYAT);

    await AsyncStorage.setItem(KUNCI_RIWAYAT, JSON.stringify(daftarBaru));
  } catch (error) {
    console.error("Gagal menyimpan riwayat pencarian:", error);
  }
}

// Menghapus satu item riwayat pencarian berdasarkan id kota
export async function hapusSatuRiwayatPencarian(id: number): Promise<void> {
  try {
    const daftarLama = await ambilRiwayatPencarian();
    const daftarBaru = daftarLama.filter((item) => item.id !== id);
    await AsyncStorage.setItem(KUNCI_RIWAYAT, JSON.stringify(daftarBaru));
  } catch (error) {
    console.error("Gagal menghapus item riwayat:", error);
  }
}
