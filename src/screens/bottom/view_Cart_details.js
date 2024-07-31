import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, RefreshControl, Image, TextInput, Dimensions, ScrollView, BackHandler } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from "react-native-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { useToast } from "react-native-toast-notifications";

const ShimmerView = createShimmerPlaceholder(LinearGradient)




const View_cart_details = (props) => {
    const navigation = useNavigation();

    // useEffect(() => {
    //     const backHandler = BackHandler.addEventListener(
    //         'hardwareBackPress',
    //         () => {
    //             navigation.navigate('Home'); // Yahan 'Home' ki jagah apne home screen ka naam likhein
    //             return true;
    //         }
    //     );

    //     return () => backHandler.remove();
    // }, [navigation]);

    const toast = useToast();
    const [viewCartData, setViewCartData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(true);
    const [total, setTotal] = useState(0);
    const [cartLength, setCartLength] = useState(0);
    const [userId, setUserId] = useState('');
    const randomNumber = useSelector(state => state.randomNumber.randomNumber);

    // Fetching user ID from AsyncStorage--------------------------------------------------
    useEffect(() => {
        const getMyObject = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('user_details');
                if (jsonValue !== null) {
                    const userDetails = JSON.parse(jsonValue);
                    const firstUserId = userDetails.length > 0 ? userDetails[0].user_id : null;
                    setUserId(firstUserId);
                } else {
                    setUserId(randomNumber);
                }
            } catch (e) {
                console.log('Error getting object:', e);
            }
        };
        getMyObject();
    }, [randomNumber]);

    // Fetching cart data------------------------------------------------------------
    const add_to_cart = async () => {
        try {
            const url = `https://demo.cogentecommerce.com/api/cart_api.php?cart=cart-products&user_id=${userId}`;
            const response = await fetch(url);
            const result = await response.json();
            if (result.msg) {
                setCartLength(result.cart_count);
                setViewCartData(result.msg);
                const totalPrice = result.msg.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                setTotal(totalPrice);
                console.log(result.msg)
            } else {
                setCartLength(0);
                setViewCartData([]);
                setTotal(0);
            }
            setIsLoaded(false);
        } catch (error) {
            console.log('Fetch error:', error);
        }
    };

    useEffect(() => {
        add_to_cart();
    }, [userId]);

    // Deleting cart item----------------------------------------------------------------------
    const deleteCart = async (id) => {
        try {
            const url = `https://demo.cogentecommerce.com/api/cart_api.php?cart=delete-cart-item&id=${id}`;
            const response = await fetch(url, { method: 'delete' });
            if (response.ok) {
                add_to_cart();
                toast.show("Successfully Deleted", { type: "warning", placement: "top", duration: 4000 });
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            console.log('Delete error:', error);
        }
    };

    // Incrementing quantity-----------------------------------------------------------------------
    const inc = async (cart_id) => {
        try {
            const url = `https://demo.cogentecommerce.com/api/cart_api.php?cart=add-quantity&id=${cart_id}`;
            const response = await fetch(url);
            if (response.ok) {
                add_to_cart();
                toast.show("Successfully Added", { type: "success", placement: "top", duration: 4000 });
            } else {
                throw new Error('Failed to increment');
            }
        } catch (error) {
            console.log('Increment error:', error);
        }
    };

    // Decrementing quantity--------------------------------------------------------------------------
    const dec = async (cart_id) => {
        try {
            const url = `https://demo.cogentecommerce.com/api/cart_api.php?cart=sub-quantity&id=${cart_id}`;
            const response = await fetch(url);
            if (response.ok) {
                add_to_cart();
            } else {
                throw new Error('Failed to decrement');
            }
        } catch (error) {
            console.log('Decrement error:', error);
        }
    };

    // Refresh control function----------------------------------------------------------
    const [refresh, setRefresh] = useState(false);
    const pullme = () => {
        setRefresh(true);
        add_to_cart();
        setTimeout(() => {
            setRefresh(false);
        }, 4000);
    };

    // Focus effect to re-fetch cart data when navigating back to the screen--------------------------
    useFocusEffect(
        React.useCallback(() => {
            add_to_cart();
        }, [userId])
    );

    return (

        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
            <View>
                <Text style={{ color: 'black', fontSize: responsiveFontSize(2.8), letterSpacing: 1, textAlign: 'center', padding: 10 }}>View Cart Details</Text>
                <Image style={{ alignSelf: 'center' }} source={require('../../NewAssets/line.png')} />
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={() => pullme()} />
                }>
                <View>


                    {/* ------------CheckOut cards------------- */}
                    {isLoaded ? (


                        <Animatable.View animation={'fadeInDown'} style={{ alignSelf: 'center' }}>
                            <View style={{
                                width: responsiveWidth(98), flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', justifyContent: 'space-between', borderRadius: 10, marginTop: 5, shadowColor: "#000", padding: 6, shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,

                            }}>
                                <ShimmerView style={{ backgroundColor: '#9e9e9e', width: responsiveWidth(40), height: responsiveHeight(15), borderRadius: 5, opacity: .4 }}>
                                </ShimmerView>
                                <View>
                                    <View style={{ width: responsiveWidth(55), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 5, margin: 5 }}>
                                        <ShimmerView style={{ width: responsiveWidth(42), backgroundColor: '#9e9e9e', padding: 15, borderRadius: 5, opacity: .4 }}></ShimmerView>
                                        <ShimmerView style={{ backgroundColor: '#9e9e9e', width: responsiveWidth(6), height: responsiveHeight(4), margin: 5, borderRadius: 5, opacity: .4 }}></ShimmerView>
                                    </View>
                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', width: responsiveWidth(40), marginLeft: 10 }}>

                                        <ShimmerView style={{ backgroundColor: '#9e9e9e', width: responsiveWidth(20), padding: 10, borderRadius: 5, margin: 5, opacity: .4 }}></ShimmerView>
                                        <ShimmerView style={{ backgroundColor: '#9e9e9e', width: responsiveWidth(15), borderRadius: 5, padding: 10, margin: 5, opacity: .4 }}></ShimmerView>

                                    </View>
                                </View>
                            </View>
                        </Animatable.View>
                    ) : (
                        <View>

                            {
                                viewCartData?.map((item, index) => {
                                    return (
                                        <View>
                                            {item.product_name ? (

                                                <Animatable.View animation={'fadeInDown'} style={{ alignSelf: 'center' }}>
                                                    <View key={index} style={{
                                                        width: responsiveWidth(98), flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', justifyContent: 'space-between', borderRadius: 10, marginTop: 5, padding: 6, shadowColor: "#000",
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 2,
                                                        },
                                                        shadowOpacity: 0.25,
                                                        shadowRadius: 3.84,
                                                        elevation: 5,
                                                        borderColor: 'gray',
                                                        borderWidth: .5
                                                    }}>
                                                        <View>
                                                            <Image style={{ resizeMode: 'contain', width: responsiveWidth(40), height: responsiveHeight(15) }} source={{ uri: item.product_image }} />
                                                        </View>
                                                        <View>
                                                            <View style={{ width: responsiveWidth(55), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 5, margin: 5 }}>
                                                                <View style={{ width: responsiveWidth(42) }}>
                                                                    <Text style={{ color: '#555555', fontSize: responsiveFontSize(2.8), fontWeight: '600' }}>{item.product_name}</Text>
                                                                </View>

                                                                <View>
                                                                    <TouchableOpacity onPress={() => deleteCart(item.id)}>
                                                                        <Icon name={item.product_name ? 'delete-outline' : null} color='black' size={25} />
                                                                    </TouchableOpacity>
                                                                </View>

                                                            </View>



                                                            <View style={{ flexDirection: 'column', justifyContent: 'space-between', width: responsiveWidth(40), marginLeft: 5 }}>


                                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: responsiveWidth(30), padding: 5 }}>


                                                                    <TouchableOpacity onPress={() => dec(item.id)} disabled={item.quantity == 1}>
                                                                        <View style={{
                                                                            backgroundColor: '#E7EAEF', padding: 5, borderRadius: 5, alignSelf: 'center', alignItems: 'center', shadowColor: "#000",
                                                                            shadowOffset: {
                                                                                width: 0,
                                                                                height: 2,
                                                                            },
                                                                            shadowOpacity: 0.25,
                                                                            shadowRadius: 3.84,
                                                                            elevation: 5,
                                                                        }}>
                                                                            <Icon name="minus" color='black' size={25} />

                                                                        </View>
                                                                    </TouchableOpacity>

                                                                    <Text style={{ color: 'black', fontSize: 20 }}>{item.quantity}</Text>


                                                                    <TouchableOpacity onPress={() => inc(item.id)} disabled={item.available_stock_quantity == item.quantity}>
                                                                        <View style={{
                                                                            backgroundColor: '#E7EAEF', borderRadius: 5, alignSelf: 'center', alignItems: 'center', padding: 5, shadowColor: "#000",
                                                                            shadowOffset: {
                                                                                width: 0,
                                                                                height: 2,
                                                                            },
                                                                            shadowOpacity: 0.25,
                                                                            shadowRadius: 3.84,
                                                                            elevation: 5,
                                                                        }}>
                                                                            <Icon name="plus" color='black' size={25} />

                                                                        </View>
                                                                    </TouchableOpacity>

                                                                </View>

                                                                <Text style={{ color: '#DD8560', fontSize: responsiveFontSize(2.5), fontWeight: '600', padding: 5 }}> {item.price ? "Price : " + item.price * item.quantity : null}</Text>

                                                            </View>


                                                        </View>

                                                    </View>


                                                </Animatable.View>
                                            ) : (<Text style={{ color: 'black', textAlign: 'center', padding: 10, fontSize: responsiveFontSize(2) }}>product not added</Text>)}
                                        </View>

                                    )
                                })
                            }
                        </View>


                    )}

                </View>

            </ScrollView>
            <View>
                {cartLength ? (
                    <Animatable.View animation={'fadeInDown'} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: responsiveWidth(98), alignSelf: 'center', backgroundColor: '#000', padding: 8, borderRadius: 10, marginTop: 10 }}>
                        <View>
                            <Animatable.View animation={'fadeInLeft'}>
                                {total ? (
                                    <Text style={{ fontSize: responsiveFontSize(2.8), color: '#fff', fontWeight: '500' }}>{'Sub Total : ' + total}</Text>
                                ) : null}
                            </Animatable.View>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('checkout')}>

                            <View style={{ width: responsiveWidth(30), backgroundColor: '#fff', borderRadius: 10 }} ><Text style={{ fontSize: responsiveFontSize(2.3), padding: 5, color: '#000', textAlign: 'center' }}>CHECKOUT</Text></View>
                        </TouchableOpacity>

                    </Animatable.View>
                ) : null}
            </View>
            <View style={{ height: responsiveHeight(10) }}></View>





        </SafeAreaView>
    )
};




export default View_cart_details;