import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, RefreshControl, Dimensions, ScrollView, BackHandler } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import * as Animatable from 'react-native-animatable';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedLoader from 'react-native-animated-loader';
import { generateRandomNumber } from "../Redux/actions";
import { useToast } from "react-native-toast-notifications";


const Deals_detail = (props) => {

    const navigation = useNavigation();
    const { image, weight, deal_id, deal_name, price } = props.route.params;
    console.log(props.route.params)
    const [user_id, setuser_id] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [visible, setVisible] = useState(false);
    const [productId, setProductid] = useState();
    const [viewCartData, setViewCartData] = useState('');
    const [quantity, setquantity] = useState(1);


    const toast = useToast();

    //    -----------------redux-------------------------
    const randomNumber = useSelector(state => state.randomNumber.randomNumber);


    // ------------------AsyncStorage get data -------------------------
    const getMyObject = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('user_details')
            if (jsonValue != null) {
                const userDetails = JSON.parse(jsonValue);
                let firstUserId = userDetails.length > 0 ? userDetails[0].user_id : null;
                setuser_id(firstUserId);
            } else {
                setuser_id(randomNumber)
            }
        } catch (e) {
            console.log('get object error' + e);
        }
    };

    useEffect(() => {
        getMyObject();
    }, []);
    // -----------------------------------------------------------------------------------------------------
    const getAddtocart = async () => {
        try {
            const url = `https://demo.cogentecommerce.com/api/cart_api.php?cart=cart-products&user_id=${user_id}`;
            const response = await fetch(url);
            const result = await response.json();

            if (result) {
                let id = result.msg?.map((item) => +item.product_id);
                // setProductid(id);
                setViewCartData(result.cart_count);
                console.log('lenght', result.cart_count)
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (user_id) {
            getAddtocart();
        }
    }, [user_id]);

    console.log('user id', user_id)
    // -------------------------------------------------------------------------------------------
    const AddToCart_deals = async () => {
        setVisible(true)
        var formData = new FormData();
        formData.append('user_id', user_id);
        formData.append('deal_id', deal_id);
        formData.append('deal_image', image);
        formData.append('deal_name', deal_name);
        formData.append('quantity', quantity);
        formData.append('price', price);
        formData.append('weight', weight * quantity);


        try {
            const url = `https://demo.cogentecommerce.com/api/cart_api.php?cart=add-to-cart-deal`;
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData
            }).then(response => response.json())
                .then((result) => {
                    console.log(result)
                    if (result) {
                        setVisible(false)
                        toast.show("Successfully Added", {
                            type: "success",
                            placement: "top",
                            duration: 4000,
                            offset: 30,
                            animationType: "slide-in",
                        });
                        setquantity(1);
                        getAddtocart();
                    }
                })
                .catch((e) => {
                    setVisible(false)
                    toast.show(e, {
                        type: "warning",
                        placement: "top",
                        duration: 4000,
                        offset: 30,
                        animationType: "slide-in",
                    });
                    console.log('error', e);
                });
        }
        catch (error) {
            console.log(error);
        }
    };
    // -----------------------------------------------------------------------------
    const inc = () => {
        setquantity(quantity + 1)
    }

    const dec = () => {
        setquantity(quantity - 1)
    }
    // --------------------------------------------------------------------------------------------------------
    useFocusEffect(
        React.useCallback(() => {
            setViewCartData('')

            setquantity(1);
        }, [])
    );
    //--------------------------------------------------------------------------------------
    useFocusEffect(
        React.useCallback(() => {

        }, [])
    );
    //---------------------------------------------------------------------------------------
    const pullme = () => {
        setRefresh(true);
        getAddtocart();
        setTimeout(() => {
            setRefresh(false);
        }, 4000);
    };
    //----------------------------------------------------------------------------------------
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                navigation.navigate('deals');
                return true;
            }
        );

        return () => backHandler.remove();
    }, [navigation]);

    return (
        // ---------------Top Navbar-----------------
        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>

            <AnimatedLoader
                visible={visible}
                overlayColor="rgba(255,255,255,0.95)"
                animationStyle={{ width: 100, height: 100, }}
                speed={1}>
                <Text>Loading...</Text>
            </AnimatedLoader>

            {/* ---------------card Details------------- */}


            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={() => pullme()} />
                }>
                <View style={{ flexDirection: 'column', justifyContent: 'space-between', height: responsiveHeight(100) }}>

                    <View>

                        <View style={{ width: responsiveWidth(100), alignSelf: 'center' }}>

                            <View>
                                <Animatable.View animation={'slideInDown'} style={{
                                    backgroundColor: '#fff',
                                    borderRadius: 60,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    width: responsiveWidth(100),
                                    height: responsiveHeight(40),
                                    elevation: 5,
                                    alignSelf: 'center',
                                    marginTop: 15
                                }}>
                                    <Animatable.Image animation={'slideInDown'} style={{ width: responsiveWidth(100), height: responsiveHeight(40), resizeMode: 'contain', alignSelf: 'center', borderRadius: 60 }} source={{ uri: image }} />

                                </Animatable.View>
                                <Animatable.View animation={'slideInUp'} >

                                    <View style={{ margin: 10 }}>
                                        <Text style={{ color: 'black', fontSize: responsiveFontSize(3.5), fontWeight: 'bold' }}>{deal_name}</Text>
                                    </View>


                                </Animatable.View>
                            </View>
                        </View>

                        {/* ---------------------------------------------------------------------------- */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 5 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: responsiveWidth(40), margin: 5 }}>


                                <TouchableOpacity disabled={quantity == 1} onPress={() => dec()} >
                                    <View style={{
                                        backgroundColor: '#E7EAEF',
                                        width: responsiveWidth(10),
                                        height: responsiveHeight(4),
                                        borderRadius: 5,
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                        elevation: 5,
                                    }}>
                                        <Icon name="minus" color='black' size={30} />

                                    </View>
                                </TouchableOpacity>

                                <Text style={{ color: 'black', fontSize: 20 }}>{quantity}</Text>



                                <TouchableOpacity onPress={() => inc()}>

                                    <View style={{
                                        backgroundColor: '#E7EAEF',
                                        width: responsiveWidth(10),
                                        height: responsiveHeight(4),
                                        borderRadius: 5,
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                        elevation: 5,
                                    }}>
                                        <Icon name="plus" color='black' size={30} />

                                    </View>
                                </TouchableOpacity>


                            </View>


                            {/* ---------------------------------------Cart counter------------------------------------------- */}
                            <View>

                                {viewCartData && viewCartData > 0 ? (

                                    <TouchableOpacity activeOpacity={.8} onPress={() => navigation.navigate('view_cart_details')}>

                                        <View
                                            style={{
                                                width: responsiveWidth(18), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E7EAEF', borderRadius: 40, padding: 8, shadowColor: "#000",
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 2,
                                                },
                                                shadowOpacity: 0.25,
                                                shadowRadius: 3.84,
                                                elevation: 5,
                                            }}>
                                            <Icon name="cart" size={25} color='black' />
                                            <Animatable.Text animation={'zoomInDown'} style={{ fontSize: responsiveFontSize(2.5), fontWeight: '600', color: 'black' }}>{viewCartData}</Animatable.Text>
                                        </View>
                                    </TouchableOpacity>) : null}
                            </View>
                        </View>

                        {/* ------------------------------------------------------------------------------ */}
                        <View style={{ marginLeft: 10 }}>

                            {/* <Text style={{ color: 'black', fontSize: responsiveFontSize(2.5), padding: 5 }}>{weight}</Text> */}
                            <Text style={{ color: '#DD8560', fontSize: responsiveFontSize(3), fontWeight: 'bold', padding: 5 }}>{'Rs. ' + price * quantity}</Text>

                        </View>
                        {/* ------------------------------------btn------------------------------- */}



                        <View>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => AddToCart_deals()} >
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center', backgroundColor: 'black',
                                    padding: 5,
                                }}>
                                    <Icon name="plus" color="white" size={25} />
                                    <Text style={{ color: 'white', marginLeft: 5, fontSize: responsiveFontSize(2.5) }}>
                                        Add to Cart
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>


                    </View>
                    <View style={{ padding: 15, backgroundColor: '#F2F3F4' }}>
                        <Text style={{ color: 'gray', fontSize: 16, textAlign: 'center' }}>Copyright© Cogent Dev Software solution.</Text>
                    </View>
                </View>

            </ScrollView>


        </SafeAreaView >
    )
};

const style = StyleSheet.create({

    card: {

        backgroundColor: 'white',
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
    dropDownSelector: {
        width: responsiveWidth(50),
        backgroundColor: '#fff',

        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 10,
        padding: 5,
        margin: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    dropDownAera: {
        width: responsiveWidth(50),
        borderRadius: 10,
        margin: 5,
        backgroundColor: '#fff',
        padding: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    countriesItem: {
        width: responsiveWidth(50),
        padding: 5,
        alignSelf: 'center',
        justifyContent: 'center'
    },

});

export default Deals_detail;