import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, SafeAreaView, Button, StatusBar, TouchableOpacity, FlatList, ScrollView, Dimensions, ImageBackground, Image, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import { useNavigation } from '@react-navigation/native';
import NavbarTop from "../drawer/navbar";
import { SliderBox } from "react-native-image-slider-box";
import PropTypes from 'deprecated-react-native-prop-types';
import * as Animatable from 'react-native-animatable';
import LinearGradient from "react-native-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { useDispatch, useSelector } from 'react-redux';
import { generateRandomNumber } from "../Redux/actions";
import { ProductContext } from "../bottom/product";
const ShimmerView = createShimmerPlaceholder(LinearGradient)
const arry = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]


const Shop = ({ props }) => {
    const navigation = useNavigation();

    //    -----------------redux-------------------------


    const dispatch = useDispatch();
    const randomNumber = useSelector(state => state.randomNumber.randomNumber);

    useEffect(() => {
        if (!randomNumber) {
            dispatch(generateRandomNumber());
        }
    }, []);
    console.log(randomNumber)


 


    const { productData, isLoaded } = useContext(ProductContext);



    return (

        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>

            {/* ----------Top NavBar--------- */}
            <Animatable.View animation={'slideInDown'}>
                <NavbarTop />
            </Animatable.View>


            {/* ---------------------Main Page View------------- */}
            <ScrollView>

              




                {isLoaded ?
                    (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', width: responsiveWidth(100) }}>
                            {arry.map((item) => {
                                return (
                                    <View style={{
                                        backgroundColor: '#fff',
                                        width: responsiveWidth(46),
                                        height: responsiveHeight(46),
                                        margin: 7,
                                        borderRadius: 10,

                                    }} >
                                        <ShimmerView style={{
                                            width: responsiveWidth(46),
                                            height: responsiveHeight(35),
                                            borderRadius: 10,
                                        }}>
                                            <ShimmerView style={{ backgroundColor: '#9e9e9e', width: responsiveWidth(46), height: responsiveHeight(15), borderTopLeftRadius: 10, borderTopRightRadius: 10, opacity: .4 }}></ShimmerView>
                                        </ShimmerView>
                                        <View style={{ padding: 10, height: responsiveHeight(10), flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <ShimmerView style={{ width: responsiveWidth(40), height: responsiveHeight(3), backgroundColor: '#9e9e9e', opacity: .4, borderRadius: 8 }}></ShimmerView>
                                            <ShimmerView style={{ width: responsiveWidth(30), height: responsiveHeight(3), backgroundColor: '#9e9e9e', opacity: .4, borderRadius: 8 }}></ShimmerView>

                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                    )
                    :
                    (

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', width: responsiveWidth(100) }}>
                            {productData && productData.map((item, index) => {
                                return (
                                    <TouchableOpacity activeOpacity={.8} onPress={() => navigation.navigate('productDetails', {
                                        image: item.image,
                                        product_name: item.product_name,
                                        details: item.description,
                                        price: item.price,
                                        weight: item.weight,
                                        brand: item.brand_name,
                                        unit: item.unit,
                                        product_id: item.product_id

                                    })}>
                                        <Animatable.View animation={'fadeInUpBig'} style={style.card} key={index}>
                                            <View style={style.cardView}>

                                                <Image style={{ resizeMode: 'contain', width: responsiveWidth(46), height: responsiveHeight(35), borderRadius: 10 }} source={{ uri: item.image }} />
                                            </View>
                                            <View style={{ padding: 10, height: responsiveHeight(11), borderBottomLeftRadius: 10, borderBottomRightRadius: 10, flexDirection: 'column', justifyContent: 'space-between' }}>

                                                <Text style={{ color: 'black', fontSize: responsiveFontSize(2.1), textAlign: 'center', fontWeight: '500' }}>{item.product_name} </Text>


                                                <Text style={{ color: 'orange', fontSize: responsiveFontSize(2.5), textAlign: 'center' }}>Rs.{item.price}</Text>
                                            </View>
                                        </Animatable.View>
                                    </TouchableOpacity>



                                )
                            })}

                        </View>

                    )}






               


                {/* -------------------------------New Arrivals------------------------------------- */}
                <View>
                    <Text style={{ color: 'black', textAlign: 'center', fontSize: 24, marginTop: 40 }}>New Arrival</Text>
                    <View style={{ alignSelf: 'center', margin: 10 }}>
                        <Image source={require('../../NewAssets/line.png')} />
                    </View>
                </View>

                {/* -------------------------scroll horizontal cards--------------------------------- */}
                <ScrollView horizontal>
                    <View style={{ flexDirection: 'row' }} >
                        {productData?.filter((item) => item.is_new_arrival == 1)
                            ?.map((item) => {
                                return (
                                    <TouchableOpacity activeOpacity={.8} onPress={() => navigation.navigate('productDetails', {
                                        image: item.image,
                                        product_name: item.product_name,
                                        product_id: item.product_id,
                                        details: item.description,
                                        price: item.price,
                                        brand: item.brand_name,
                                        id: item.id
                                    })}>
                                        <View style={style.scrollCard} key={item.product_id}>
                                            <View style={{
                                                width: responsiveWidth(80), height: responsiveHeight(40), alignSelf: 'center', shadowColor: "#000",
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 2,
                                                },
                                                shadowOpacity: 0.25,
                                                shadowRadius: 3.84,

                                                elevation: 5,
                                            }}>

                                                <Image style={{ resizeMode: 'contain', width: responsiveWidth(80), height: responsiveHeight(40), borderTopLeftRadius: 10, borderTopRightRadius: 10 }} source={{ uri: item.image }} />
                                            </View>
                                            <View style={{ width: responsiveWidth(80), height: responsiveHeight(15), flexDirection: 'column', justifyContent: 'space-between' }}>

                                                <Text style={{ color: 'black', textAlign: 'center', fontSize: responsiveFontSize(3), fontWeight: '600' }}>{item.product_name}</Text>

                                                <Text style={{ color: "orange", fontSize: responsiveFontSize(3), textAlign: 'center', margin: 5, fontWeight: '700' }}>Rs.{item.price}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>

                                )
                            })}
                    </View>
                </ScrollView>


                {/* ------------------------Featured---------------------------------------- */}
                <View>
                    <Text style={{ color: 'black', textAlign: 'center', fontSize: 24, marginTop: 40 }}>Featured</Text>
                    <View style={{ alignSelf: 'center', margin: 10 }}>
                        <Image source={require('../../NewAssets/line.png')} />
                    </View>
                </View>

                {/* --------------------------scroll horizontal cards--------------------- */}
                <ScrollView horizontal>
                    <View style={{ flexDirection: 'row' }} >
                        {productData?.filter((item) => item.is_featured == 1)
                            ?.map((item) => {

                                return (
                                    <TouchableOpacity activeOpacity={.8} onPress={() => navigation.navigate('productDetails', {
                                        image: item.image,
                                        product_name: item.product_name,
                                        product_id: item.product_id,
                                        details: item.description,
                                        price: item.price,
                                        brand: item.brand_name,
                                        id: item.id
                                    })}>
                                        <View style={style.scrollCard} key={item.product_id}>
                                            <View style={{
                                                width: responsiveWidth(80), height: responsiveHeight(40), alignSelf: 'center', shadowColor: "#000",
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 2,
                                                },
                                                shadowOpacity: 0.25,
                                                shadowRadius: 3.84,

                                                elevation: 5,
                                            }}>

                                                <Image style={{ resizeMode: 'contain', width: responsiveWidth(80), height: responsiveHeight(40), borderTopLeftRadius: 10, borderTopRightRadius: 10 }} source={{ uri: item.image }} />
                                            </View>
                                            <View style={{ width: responsiveWidth(80), height: responsiveHeight(15), flexDirection: 'column', justifyContent: 'space-between' }}>

                                                <Text style={{ color: 'black', textAlign: 'center', fontSize: responsiveFontSize(3), fontWeight: '600' }}>{item.product_name}</Text>

                                                <Text style={{ color: "orange", fontSize: responsiveFontSize(3), textAlign: 'center', margin: 5, fontWeight: '700' }}>Rs.{item.price}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>

                                )
                            })}
                    </View>
                </ScrollView>


              

                <View style={{ paddingBottom: 70 }}>
                </View>


            </ScrollView>

        </SafeAreaView >


    )
};
Shop.propTypes = {
    someProp: PropTypes.string,
};
const { width, height } = Dimensions.get("screen");

const style = StyleSheet.create({
  
   
    // -----------New Arrival Cards-------------
    card: {

        backgroundColor: '#fff',
        width: responsiveWidth(46),
        height: responsiveHeight(46),
        margin: 7,
        borderRadius: 10,



    },
    cardView: {
        width: responsiveWidth(46),
        height: responsiveHeight(35),
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
   
    // --------------trending------------
    trendingCard: {
        color: "black",
        fontSize: responsiveFontSize(2.5),
        textAlign: 'center',
        borderRadius: 50,
        padding: 10,
        backgroundColor: "#F9F9F9"
    },

    // ------------scrollCard-------
    scrollCard: {
        backgroundColor: "#FFFFFF",
        width: responsiveWidth(80),
        height: responsiveHeight(55),
        margin: 5,
        borderRadius: 10,
        alignSelf: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,

    },
    iconscard: {
        resizeMode: 'contain',
        width: 100,
        alignSelf: 'center',
        height: 50,
    }
});



export default Shop;