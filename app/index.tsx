import React, {useEffect} from "react";
import {Image, View, StyleSheet} from "react-native";
import {colors} from "@/constants/theme";
import {useRouter} from "expo-router";

const Index = () => {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => router.push("/welcome"), 2000);
    }, [router]);

    return (
        <View style={styles.container}>
            <Image source={require("../assets/images/splashImage.png")} />
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.neutral900,
    },
    logo: {
        height: '20%',
        aspectRatio: 1
    }
});