import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import * as Animatable from 'react-native-animatable';


const SplashScreen = ({ navigation }) => {

    useEffect(() => {
        setTimeout(() => {

            navigation.replace('main')

        }, 1000);

    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
            <Animatable.Image animation={'flipInY'} style={{ width: responsiveWidth(50), height: responsiveHeight(30), resizeMode: 'contain' }} source={require('../../NewAssets/foreeshop.png')} />
        </View>
    )
};

export default SplashScreen;