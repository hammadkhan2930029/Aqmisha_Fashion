import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Button, StatusBar, TouchableOpacity, FlatList, ScrollView, Dimensions, ImageBackground, Image } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons'
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";

import { useNavigation } from '@react-navigation/native';

const NavbarTop = () => {
    const navigation = useNavigation();

    return (<SafeAreaView>

        <StatusBar
            animated={true}
            backgroundColor='#fff'
            barStyle={'dark-content'}
            showHideTransition={'fade'}

        />
        <View style={style.TopNavbar}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <View style={style.drawerBtnView}>
                    <Icon name='menu' color='black' size={30} />

                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate('main_drawer')}>

                <View style={style.Logo}>

                    <Image style={style.logoImage} source={require('../../NewAssets/foreeshop.png')} />
                </View>
            </TouchableOpacity>

            <View style={style.SearchAndCard}>
                <TouchableOpacity onPress={() => navigation.navigate("Search")}>
                    <View style={style.searchIcon}>
                        <Icon name='search' color='black' size={30} />

                    </View>
                </TouchableOpacity>

            </View>
        </View>
    </SafeAreaView>


    )
}

const style = StyleSheet.create({
    // ------------Top navbar-----------
    TopNavbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: '#fff',
        padding: 8,
        width: responsiveWidth(100),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,

        elevation: 12,


    },
    SearchAndCard: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    searchIcon: {
        marginRight: 5
    },
    cartIcon: {
        marginRight: 5

    },
    Logo: {

        width: responsiveWidth(14),
        height: responsiveHeight(7)
    },
    logoImage: {
        resizeMode: 'contain',
        width: responsiveWidth(14),
        height: responsiveHeight(7)
    },


});

export default NavbarTop;