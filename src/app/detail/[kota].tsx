// app/detail/[kota].tsx
import { router, useLocalSearchParams } from "expo-router";
import { Button, View } from "react-native";
import WeatherCard from "../../components/WeatherCard";
import { spacing } from "../../constants/styles";

export default function HalamanDetail() {
    const { kota } = useLocalSearchParams<{ kota: string }>();

    return (
        <View style={{ padding: spacing.sedang, gap: spacing.sedang }}>
            <WeatherCard kota={kota} suhu={29} tingkatAQI="BAIK" />
            <Button
                title="Tambahkan ke Favorit"
                onPress={() =>
                    router.push({ pathname: "/tambah-favorit", params: { kota } })
                }
                accessibilityLabel={`Tambahkan ${kota} ke daftar favorit`}
            />
        </View>
    );
}