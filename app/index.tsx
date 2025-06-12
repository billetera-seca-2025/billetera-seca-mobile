import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { LoginScreen } from '../components/auth/LoginScreen';
import { authService } from "../utils/authService";

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

export default function Login() {
    const router = useRouter();

    return (
        <LoginScreen
            onLogin={async (email, password) => {
                await authService.login(email, password).then((authenticated) => {
                    if (authenticated) {
                        router.replace('/home');
                    } else {
                        throw new Error('Credenciales inválidas');
                    }
                });
            }}
            onRegister={() => {
                router.push('/register');
            }}
        />
    );
}

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