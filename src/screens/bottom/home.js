import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, SafeAreaView, Button, StatusBar, TouchableOpacity, FlatList, ScrollView, Dimensions, ImageBackground, Image, ActivityIndicator, Linking } from "react-native";
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
import { ProductContext } from "./product";
const ShimmerView = createShimmerPlaceholder(LinearGradient)
const arry = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]


const Home = ({ props }) => {
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


    const imageSlider = [
        require('../../NewAssets/slider1.jpg'),
        require('../../NewAssets/slider2.jpg'),
        require('../../NewAssets/slider3.jpg'),
        require('../../NewAssets/slider4.jpg'),

    ];


    const { productData, isLoaded } = useContext(ProductContext);



    return (

        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>

            {/* ----------Top NavBar--------- */}
            <Animatable.View animation={'slideInDown'}>
                <NavbarTop />
            </Animatable.View>


            {/* ---------------------Main Page View------------- */}
            <ScrollView>

                <Animatable.View animation={'flipInX'}>

                    <SliderBox images={imageSlider}
                        dotColor="orange"
                        inactiveDotColor="white"
                        imageLoadingColor='ornage'
                        autoplay={true}
                        autoplayInterval={8000} />
                </Animatable.View>




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
                                console.log(item)
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






                {/* -----------------------------------Collections----------------------------------- */}

                <View>
                    <Text style={{ color: 'black', fontSize: responsiveFontSize(3.5), textAlign: 'center', marginTop: 40 }}>COLLECTIONS</Text>
                </View>

                <View style={{ marginTop: -50, width: responsiveWidth(100) }}>
                    <Image style={{ resizeMode: 'contain', width: responsiveWidth(100) }} source={require('../../assets/collection.png')} />
                </View>

                <View >
                    <Image style={{ resizeMode: 'stretch', width: responsiveWidth(100), alignSelf: 'center' }} source={require('../../assets/collection-one.png')} />
                </View>
                {/* -------------------------------On Sale------------------------------------- */}
                <View style={{ marginTop: 20 }}>
                    <View >
                        <Text style={{ color: 'black', textAlign: 'center', fontSize: responsiveFontSize(3.5), }}>On Sale</Text>
                    </View>
                    <View style={{ alignSelf: 'center', margin: 10 }}>
                        <Image source={require('../../NewAssets/line.png')} />
                    </View>
                </View>

                {/* -------------------------scroll horizontal cards--------------------------------- */}
                <ScrollView horizontal>
                    <View style={{ flexDirection: 'row' }} >
                        {productData?.filter((item) => item.on_sale == 1)
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
                                                <View>

                                                    <Text style={{ color: 'black', textAlign: 'center', fontSize: responsiveFontSize(3), fontWeight: '600' }}>{item.product_name}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>

                                                    <Text style={{ color: "lightgray", fontSize: responsiveFontSize(3), textAlign: 'center', margin: 5, fontWeight: '700', textDecorationLine: 'line-through', }}>Rs.{item.price}</Text>
                                                    <Text style={{ color: "orange", fontSize: responsiveFontSize(3), textAlign: 'center', margin: 5, fontWeight: '700' }}>Rs.{item.price - item.sale_price}</Text>


                                                </View>
                                                <View>


                                                    <Text style={{ color: "gray", fontSize: responsiveFontSize(2), textAlign: 'center', margin: 5, }}>{"Rs." + item.sale_price + ' OFF'}</Text>


                                                </View>

                                            </View>
                                        </View>
                                    </TouchableOpacity>

                                )
                            })}
                    </View>
                </ScrollView>




                {/* -------------------------------New Arrivals------------------------------------- */}
                <View>
                    <Text style={{ color: 'black', textAlign: 'center', fontSize: responsiveFontSize(3.5), marginTop: 40 }}>New Arrival</Text>
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
                    <Text style={{ color: 'black', textAlign: 'center', fontSize: responsiveFontSize(3.5), marginTop: 40 }}>Featured</Text>
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


                {/* ---------------Social Media------------- */}
                <Text style={{ color: 'black', textAlign: 'center', fontSize: responsiveFontSize(3.2), padding: 10, letterSpacing: 5 }}>FOLLOW US</Text>

                <TouchableOpacity style={{ alignSelf: 'center', margin: 10 }} onPress={() => Linking.openURL('https://www.instagram.com/aqmisha.bf/?utm_source=qr&igshid=MzNlNGNkZWQ4Mg%3D%3D')}>
                    <Icon name='instagram' size={45} color='#000' />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: responsiveWidth(100) }}>
                    <TouchableOpacity>
                        <Image style={{ resizeMode: 'contain', width: responsiveWidth(40), margin: 5, borderRadius: 10 }} source={require('../../NewAssets/SocialOne.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image style={{ resizeMode: 'contain', width: responsiveWidth(40), margin: 5, borderRadius: 10 }} source={require('../../NewAssets/SocialTwo.png')} />

                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: responsiveWidth(100) }}>
                    <TouchableOpacity>
                        <Image style={{ resizeMode: 'contain', width: responsiveWidth(40), margin: 5, borderRadius: 10 }} source={require('../../NewAssets/SocialThree.png')} />

                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image style={{ resizeMode: 'contain', width: responsiveWidth(40), margin: 5, borderRadius: 10 }} source={require('../../NewAssets/SocialFour.png')} />

                    </TouchableOpacity>
                </View>



                {/* ----------------Bottom---------------- */}
                <View style={{ alignSelf: 'center' }}>
                    <Image source={require('../../NewAssets/line.png')} />
                </View>
                <View style={{ alignSelf: 'center', margin: 10 }}>
                    <View style={{ alignItems: 'center' }}>
                        <Icon name='email' size={30} color="gray" />
                        <Text style={{ color: 'black', fontSize: responsiveFontSize(2.2), textAlign: 'center', margin: 5 }}>ab.bismillahfabrics@gmail.com</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Icon name='cellphone' size={30} color="gray" />

                        <Text style={{ color: 'black', fontSize: responsiveFontSize(2.2), textAlign: 'center', margin: 5 }}>03319998780</Text>
                        <Text style={{ color: 'black', fontSize: responsiveFontSize(2.2), textAlign: 'center', margin: 5 }}>03203216788</Text>


                    </View>
                </View>

                <View style={{ paddingBottom: 70 }}>
                </View>


            </ScrollView>

        </SafeAreaView >


    )
};
Home.propTypes = {
    someProp: PropTypes.string,
};
const { width, height } = Dimensions.get("screen");

const style = StyleSheet.create({
    // ------------Top navbar-----------
    TopNavbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: '#E7EAEF',
        padding: 10,
        width: responsiveWidth(100)


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
    logoImage: {
        resizeMode: 'contain',
        width: 80,
        height: 50
    },
    // ---------------Top navbar----------
    h1: {
        backgroundColor: 'black',
        borderRadius: 50,
        padding: 15,
        width: responsiveWidth(60),
        alignSelf: 'center',
        marginTop: '25%',
        opacity: .7
    },
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
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
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



export default Home;