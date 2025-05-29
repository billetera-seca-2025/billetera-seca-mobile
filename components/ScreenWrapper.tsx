import React from "react";
import {View, StyleSheet, Text, Dimensions, Platform, StatusBar} from "react-native";
import {ScreenWrapperProps} from "@/types";
import {colors} from "@/constants/theme";

const {height} = Dimensions.get("window");

const ScreenWrapper = ({style, children}: ScreenWrapperProps) => {
    let paddingTop = Platform.OS === "ios" ? height * 0.06 : 50;

    return (
        <View
            style={[{
                flex: 1,
                paddingTop: paddingTop,
                backgroundColor: colors.neutral900,
            }, style]}
        >
            <StatusBar barStyle="light-content" />
            {children}
        </View>
    );
};

export default ScreenWrapper;

const styles = StyleSheet.create({});