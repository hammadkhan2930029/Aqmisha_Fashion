import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, RefreshControl, BackHandler, StatusBar, ScrollView, FlatList } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from '@react-navigation/native';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnotherIcon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import AnimatedLoader from 'react-native-animated-loader';


const Orderplace_details = (props) => {
    const navigation = useNavigation();
    // ---------------------------------------------------
    const [user_id, setuser_id] = useState(null);
    const [visible, setVisible] = useState(true);


    const getMyObject = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('user_details')

            if (jsonValue !== null) {
                const userdatils = JSON.parse(jsonValue)
                // console.log(userdatils)
                const get_id = userdatils.reduce((accum, item) => accum + (+item.user_id), 0)
                setuser_id(get_id)
            } else {
                setuser_id(null)
            }

        } catch (e) {
            console.log('get object error' + e)
        }

    }
    useEffect(() => {
        getMyObject()
        console.log('hello', user_id)

    })



    // -------------------------------------------------------
    const [details, setDetails] = useState()

    const view_order = async () => {
        try {
            let url = `https://aqmishafashion.online/api/order_api.php?order=view-orders&user_id=${user_id}`
            const respons = await fetch(url)
            const result = await respons.json()
                .then((result) => {
                    setDetails(result.msg)
                    console.log(result.msg)
                    if (result.msg) {
                        setVisible(false)
                    }
                }).catch(error => console.log(error))


        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if (user_id) {

            view_order()
        }

    }, [user_id])


    // ---------------------------------------------------------

    const [order_details, setOrder_details] = useState()
    const view_order_details = async (order_id) => {
        setVisible(true)

        try {
            let url = `https://aqmishafashion.online/api/order_api.php?order=view-order-detail&order_id=${order_id}`
            const respons = await fetch(url)
            const result = await respons.json()
                .then((result) => {
                    setOrder_details(result.order_detail)
                    console.log(result)
                    if (result.order_detail) {
                        setVisible(false)
                    }
                }).catch(error => console.log(error))

        } catch (error) {
            console.log(error)
        }
    }

    const [refresh, setRefresh] = useState(false)
    const pullme = () => {
        setRefresh(true)
        view_order_details()

        setTimeout(() => {
            setRefresh(false)
        }, 4000)
    }
    console.log('order', order_details)
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                navigation.replace('profile');
                return true;
            }
        );

        return () => backHandler.remove();
    }, [navigation]);

    return (

        <SafeAreaView style={{ backgroundColor: '#F8F8FF', flex: 1 }}>
            {/* --------------------------------------------- */}
            <AnimatedLoader
                visible={visible}
                overlayColor="rgba(255,255,255,0.95)"
                animationStyle={{ width: 100, height: 100, }}
                speed={1}>
                <Text>Loading...</Text>
            </AnimatedLoader>

            {/* --------------------------------------------- */}

            <StatusBar
                animated={true}
                backgroundColor='#fff'
                barStyle={'dark-content'}
                showHideTransition={'fade'}

            />

            {/* -------------------------------------------------- */}
            <Animatable.View animation={'slideInLeft'} style={{
                width: responsiveWidth(100), backgroundColor: '#ffffff', shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5, flexDirection: 'row', alignItems: 'center'
            }}>
                <View>
                    <Icon onPress={() => navigation.goBack()} name='arrow-left' size={30} color='black' />
                </View>
                <View>
                    <Text style={{ color: '#555555', fontSize: responsiveFontSize(3), fontWeight: '700', padding: 10, textAlign: 'center' }}>My Order</Text>
                </View>
            </Animatable.View>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={() => pullme()} />
                }

            >



                <View>

                    {details && details !== null ? details?.map((item, index) => {
                        console.log("Order place details :", item.response)

                        return (
                            <View>
                                {item.response == 'no data' ? (<Text style={{ color: '#000', textAlign: 'center', padding: 10 }}>No data</Text>) : (
                                    <Animatable.View animation={'fadeInDown'} key={index} style={{
                                        width: responsiveWidth(95), alignSelf: 'center', borderRadius: 20, padding: 15, marginTop: 10, backgroundColor: '#ffffff',
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,

                                        elevation: 5,
                                    }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 5 }}>

                                            <Text style={{ color: '#555555', fontSize: responsiveFontSize(2) }}>{'Order Date : ' + item.order_date}</Text>
                                            <Text style={{ color: '#555555', fontSize: responsiveFontSize(2) }}>{"Grand Total : " + item.grand_total}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 5 }}>
                                            <Text style={{ color: '#555555', fontSize: responsiveFontSize(2) }}>{'Order ID : ' + item.id}</Text>

                                            <Text style={{ color: '#555555', fontSize: responsiveFontSize(2) }}>{'Status : ' + item.order_status}</Text>
                                        </View>



                                        <TouchableOpacity onPress={() => view_order_details(item.id)}>
                                            <View style={{ width: responsiveWidth(90), alignSelf: 'center', backgroundColor: '#000', borderRadius: 10, marginTop: 10 }}>
                                                <Text style={{ color: '#fff', textAlign: 'center', fontSize: responsiveFontSize(2), fontWeight: '500', padding: 10 }}>Check Details</Text>

                                            </View>
                                        </TouchableOpacity>


                                    </Animatable.View>
                                )}
                            </View>
                        )


                    }) : null}
                </View>
                {/* ------------------------------------------------------------------------- */}
                <View>
                    {!order_details ? null : (<Text style={{ padding: 10, textAlign: 'center', color: '#000', fontSize: responsiveFontSize(3), fontWeight: '600' }}>Order details</Text>)}
                </View>

                <View style={{ marginBottom: 10, }}>
                    {order_details?.map((item, index) => {
                        return (
                            <Animatable.View animation={'bounceInLeft'} key={index} style={{
                                width: responsiveWidth(95), alignSelf: 'center', borderRadius: 20, padding: 15, marginTop: 10, backgroundColor: '#ffffff',
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5,
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ width: responsiveWidth(65) }}>

                                        <Text style={{ fontSize: responsiveFontSize(2.5), color: '#000' }}>{"Product : " + item.product_name}</Text>
                                        <Text style={{ fontSize: responsiveFontSize(2.2), color: 'gray' }}>{"Quantity : " + item.quantity}</Text>
                                    </View>
                                    <View style={{ width: responsiveWidth(20) }}>

                                        <Image style={{ width: responsiveWidth(20), height: responsiveHeight(10), borderRadius: 10 }} source={{ uri: item.product_image }} />
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 }}>
                                    <Text style={{ fontSize: responsiveFontSize(2.2), color: 'gray' }} >{"Weight : " + item.product_weight}</Text>
                                    <Text style={{ fontSize: responsiveFontSize(2.2), color: 'orange' }}>{"Price : " + item.product_price * item.quantity}</Text>
                                </View>

                            </Animatable.View>
                        )
                    })}
                </View>



            </ScrollView>

        </SafeAreaView>
    )
};


export default Orderplace_details;