import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, BackHandler, ImageBackground, Dimensions, ScrollView, FlatList } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from '@react-navigation/native';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import * as Animatable from 'react-native-animatable';
import NavbarTop from './navbar';
import LinearGradient from "react-native-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { useToast } from "react-native-toast-notifications";
import { baseUrl } from '../../Config/baseUrl';
const ShimmerView = createShimmerPlaceholder(LinearGradient)
const arry = [1, 1, 1, 1]




const Deals = () => {
    const toast = useToast();

    const navigation = useNavigation();
    const [deal_data, setDeal_data] = useState();
    const [isloaded, setIsLoaded] = useState(true)
    const deals = async () => {
        try {
            const url = `${baseUrl}/api/view_data_api.php?view=deals`
            const response = await fetch(url)
            const result = await response.json()
                .then((result) => {
                    console.log('Deals', result.msg[0].response)
                    
                    
                    if (result.msg) {

                        setDeal_data(result.msg)
                        setIsLoaded(false)
                    }
                }).catch((e) => {
                    console.log('api error', e)
                })

        } catch (error) {
            console.log('try catch error', error)

        }
    }
    useEffect(() => {
        deals()
    }, [])
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                navigation.replace('main');
                return true;
            }
        );

        return () => backHandler.remove();
    }, [navigation]);

    return (

        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
            <View>
                <NavbarTop />
            </View>
            {isloaded ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', width: responsiveWidth(100) }}>
                    {arry.map((item) => {
                        return (
                            <View style={{
                                backgroundColor: '#fff',
                                width: responsiveWidth(46),
                                height: responsiveHeight(30),
                                margin: 7,
                                borderRadius: 10,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5,
                            }} >
                                <ShimmerView style={{
                                    width: responsiveWidth(46),
                                    height: responsiveHeight(15),
                                    borderRadius: 10,
                                }}>
                                    <ShimmerView style={{ backgroundColor: '#9e9e9e', width: responsiveWidth(46), height: responsiveHeight(15), borderTopLeftRadius: 10, borderTopRightRadius: 10, opacity: .4 }}></ShimmerView>
                                </ShimmerView>
                                <View style={{ padding: 10, height: responsiveHeight(15), flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <ShimmerView style={{ width: responsiveWidth(40), height: responsiveHeight(3), backgroundColor: '#9e9e9e', opacity: .4, borderRadius: 8 }}></ShimmerView>
                                    <ShimmerView style={{ width: responsiveWidth(30), height: responsiveHeight(3), backgroundColor: '#9e9e9e', opacity: .4, borderRadius: 8 }}></ShimmerView>
                                    <ShimmerView style={{ width: responsiveWidth(15), height: responsiveHeight(3), backgroundColor: '#9e9e9e', opacity: .4, borderRadius: 8 }}></ShimmerView>

                                </View>
                            </View>
                        )
                    })}
                </View>
            ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', width: responsiveWidth(100) }}>
                    {deal_data && deal_data.map((item, index) => {
                        return (
                            <View>
                                {item.response !== 'no data' ? (
                                    <TouchableOpacity activeOpacity={.8} onPress={() => navigation.navigate("deals_detail", {
                                        deal_id: item.deal_id,
                                        deal_name: item.deal_name,
                                        image: item.image,
                                        price: item.price,
                                        weight: item.weight
                                    })}>
                                        <Animatable.View animation={'fadeInUpBig'} style={style.card} key={index}>
                                            <View style={style.cardView}>

                                                <Image style={{ resizeMode: 'contain', width: responsiveWidth(46), height: responsiveHeight(15), borderTopLeftRadius: 10, borderTopRightRadius: 10 }} source={{ uri: item.image }} />
                                            </View>
                                            <View style={{ padding: 10, height: responsiveHeight(12), borderBottomLeftRadius: 10, borderBottomRightRadius: 10, flexDirection: 'column', justifyContent: 'space-between' }}>

                                                <Text style={{ color: 'black', fontSize: responsiveFontSize(2.2), textAlign: 'center', fontWeight: '500' }}>{item.deal_name} </Text>

                                                <Text style={{ color: 'orange', fontSize: responsiveFontSize(2.5), textAlign: 'center' }}>Rs.{item.price}</Text>
                                            </View>
                                        </Animatable.View>
                                    </TouchableOpacity>
                                ) : (
                                    <View style={{ width: responsiveWidth(100),}}>
                                        <Text style={{ color: "#000", padding: 10,textAlign:'center' }}>Data Not available</Text>
                                    </View>
                                )}
                            </View>


                        )
                    })}

                </View>
            )}



        </SafeAreaView>
    )
};
const style = StyleSheet.create({
    card: {

        backgroundColor: 'white',
        width: responsiveWidth(46),
        height: responsiveHeight(28),
        margin: 7,
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
    cardView: {
        width: responsiveWidth(46),
        height: responsiveHeight(15),
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

});

export default Deals;