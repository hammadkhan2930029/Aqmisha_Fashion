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


const ProductDetails = (props) => {

    const navigation = useNavigation();
    const { image, product_id, product_name, price, details, brand, weight, unit } = props.route.params;
    const [user_id, setuser_id] = useState('');
    const [quantity, setquantity] = useState(1);
    const [viewCartData, setViewCartData] = useState('');
    const [productId, setProductid] = useState();
    const [refresh, setRefresh] = useState(false);
    // ------------------------
    const [colors, setcolors] = useState('');
    const [colorName, setColorName] = useState('');
    const [colorID, setColorID] = useState('');

    // ------------------------
    const [product_Size, setproduct_Size] = useState('');
    const [size, setsize] = useState('');
    const [size_ID, setsize_ID] = useState('0');
    //------------------------------------
    const [update_price, setupdate_price] = useState('');
    const [available_quantity, setavailable_quantity] = useState('0');
    //-----------------------------------------------
    const [no_Sizedata, setNo_Sizedata] = useState('');
    const [no_colorData, setNo_colorData] = useState('');
    //------------------------------------
    const [no_stock, setNo_stock] = useState('0');
    const [stock_response, setStock_response] = useState('')
    const [visible, setVisible] = useState(true);
    const toast = useToast();
    const [selectRadio, setSelectRadio] = useState('')
    const [selectRadio_color, setSelectRadio_color] = useState('')

    //    -----------------redux-------------------------
    const randomNumber = useSelector(state => state.randomNumber.randomNumber);
    // -----------------------regex html tag converter-------------------------------------------------
    const [plainText, setPlainText] = useState('');

    useEffect(() => {
        const cleanText = details.replace(/<\/?[^>]+(>|$)/g, '');
        setPlainText(cleanText);
    }, [details]);
    // console.log('plain text',plainText)

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
    useEffect(() => {
        if (user_id) {
            getAddtocart();
        }
    }, [user_id]);
    console.log('user id', user_id)
    //    ----------------------------------------------------------------------------------

    const inc = () => {
        setquantity(quantity + 1)
    }

    const dec = () => {
        setquantity(quantity - 1)
    }
    // -----------------------------------------------------------------------------------------------------
    const getAddtocart = async () => {
        try {
            const url = `https://demo.cogentecommerce.com/api/cart_api.php?cart=cart-products&user_id=${user_id}`;
            const response = await fetch(url);
            const result = await response.json();

            if (result) {
                let id = result.msg?.map((item) => +item.product_id);
                setProductid(id);
                setViewCartData(result.cart_count);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // --------------------------------------------------------------------------------------------------
    const AddToCart = async () => {
        setVisible(true)
        var formData = new FormData();
        formData.append('product_id', product_id);
        formData.append('product_image', image);
        formData.append('product_name', product_name);
        formData.append('price', !update_price ? price : update_price);
        formData.append('user_id', user_id);
        formData.append('weight', weight * quantity);
        formData.append('quantity', quantity);
        formData.append('color_id', colorID);
        formData.append('size_id', size_ID);

        try {
            const url = `https://demo.cogentecommerce.com/api/cart_api.php?cart=add-to-cart`;
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData
            }).then(response => response.json())
                .then((result) => {
                    if (result) {
                        toast.show("Successfully Added", {
                            type: "success",
                            placement: "top",
                            duration: 4000,
                            offset: 30,
                            animationType: "slide-in",
                        });
                        setquantity(1);
                        getAddtocart();
                        setVisible(false)
                    }
                })
                .catch((e) => {
                    console.log('error', e);
                });
        }
        catch (error) {
            console.log(error);
        }
    };
    // ------------------------------------------------------------------------------------------------------
    const getProductColor = async (size) => {
        try {
            const url = `https://demo.cogentecommerce.com/api/view_data_api.php?view=product-colors&product_id=${product_id}&size_id=${size}`;
            const response = await fetch(url);
            const result = await response.json();

            if (result && result.msg) {
                setcolors(result.msg);
                const noData = result.msg.map((item) => item.response);
                setNo_colorData(noData);
            } else {
                setcolors('');
                setNo_colorData('');
            }
        } catch (error) {
            console.log(error);
            setcolors('');
            setNo_colorData('');
        }
    };


    // ------------------------------------------------------------------------------------------------
    const get_product_size = async () => {
        try {
            const url = `https://demo.cogentecommerce.com/api/view_data_api.php?view=product-sizes&product_id=${product_id}`;
            const response = await fetch(url);
            const result = await response.json();

            if (result && result.msg) {
                setproduct_Size(result.msg);
                const noData = result.msg.map((item) => {

                    setNo_Sizedata(item.response);
                });

                setVisible(false);
            } else {
                setproduct_Size('');
                setNo_Sizedata('');
                setVisible(false);
            }
        } catch (error) {
            console.log(error);
            setproduct_Size('');
            setNo_Sizedata('');
            setVisible(false);
        }
    };
    useEffect(() => {
        get_product_size();
    }, [product_id]);




    // console.log('color', colors, 'no color', no_colorData)
    // ------------------------------------------------------------------------------------------------------
    const stock_price = async () => {
        try {
            const url = `https://demo.cogentecommerce.com/api/view_data_api.php?view=product-stock-price&product_id=${product_id}&color_id=${colorID}&size_id=${size_ID}`;
            const response = await fetch(url);
            const result = await response.json();

            if (result && result.msg) {
                result.msg.map((item) => {
                    if (item) {
                        console.log('item', item)
                        setStock_response(item)
                        // console.log('stock', item.available_quantity)
                        setupdate_price(item.up_price);
                        setavailable_quantity(item.available_quantity);
                        setNo_stock(item.response);
                    } else {
                        setavailable_quantity('0')
                    }
                });
            }
        } catch (error) {
            console.log("try catch Error", error);
        }
    };


    useEffect(() => {
        if (colorID >= 0 || size_ID >= 0) {
            stock_price();
        }
    }, [product_id, colorID, size_ID]);
    // console.log('avalabile quantity', available_quantity, 'quantity ', quantity,)
    // console.log('no stock',no_stock)
    // --------------------------------------------------------------------------------------------------------
    useFocusEffect(
        React.useCallback(() => {
            setsize('');
            setColorName('');
            setquantity(1);
            setColorID(0);
            setsize_ID('0');
            setavailable_quantity('');
            setupdate_price('');
            setNo_Sizedata('');
            setNo_colorData('');
            setNo_stock('');
            setViewCartData('');
            setVisible(true);
            setStock_response('')
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
                navigation.replace('main');
                return true;
            }
        );

        return () => backHandler.remove();
    }, [navigation]);

    //-------------------------------------------------------------------------------------


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
            <View>
                <Animatable.View animation={'slideInDown'} style={{
                    backgroundColor: '#fff',

                    width: responsiveWidth(100),
                    height: responsiveHeight(60),
                    alignSelf: 'center',
                }}>
                    <Animatable.Image animation={'slideInDown'} style={{ width: responsiveWidth(100), height: responsiveHeight(60), resizeMode: 'contain', alignSelf: 'center' }} source={{ uri: image }} />

                </Animatable.View>
            </View>

            {/* ---------------------------------------------------------------------------- */}

            <ScrollView
                style={{
                    width: responsiveWidth(100),
                    height: responsiveHeight(40),
                    alignSelf: 'center',
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 40,
                    borderTopRightRadius: 40,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={() => pullme()} />
                }>


                <View>

                    <Animatable.View animation={'slideInUp'} >

                        <View style={{ width: responsiveWidth(90), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', margin: 8 }}>
                            <Text style={{ color: 'black', fontSize: responsiveFontSize(3.5), fontWeight: 'bold' }}>{product_name}</Text>

                            <Text style={{ color: '#DD8560', fontSize: responsiveFontSize(3), fontWeight: 'bold', padding: 5 }}>Rs.{!update_price ? price * quantity : update_price * quantity}</Text>


                        </View>
                        <View style={{ width: responsiveWidth(90), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center' }}>
                            <View>
                                <Text style={{ color: 'black', fontSize: responsiveFontSize(2.5), padding: 5 }}>{brand}</Text>
                                <Text style={{ color: 'black', fontSize: responsiveFontSize(2.5), padding: 5 }}>{plainText}</Text>

                            </View>
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

                        <View >
                            {/* -----------size selector--------------------------- */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>


                                {no_Sizedata == 'no data' ? null : (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                        <View>
                                            <Text style={{ color: 'black', fontSize: responsiveFontSize(2) }}>Your size :</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {product_Size && product_Size.map((item, index) => {
                                                console.log(item)
                                                return (
                                                    <View >

                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setsize(item.size_name);
                                                                setsize_ID(item.size_id)
                                                                getProductColor(item.size_id)
                                                                setSelectRadio(item.size_id)


                                                            }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                                <View style={{ borderColor: '#000', borderWidth: 1, width: responsiveWidth(8), height: responsiveHeight(4), borderRadius: 30, margin: 5 }}>
                                                                    {selectRadio == item.size_id ? (
                                                                        <View style={{ backgroundColor: '#000', width: responsiveWidth(6), height: responsiveHeight(3), borderRadius: 30, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', margin: 3 }}></View>

                                                                    ) : null}
                                                                </View>

                                                                <Text style={{ color: 'black', fontSize: responsiveFontSize(2), textAlign: 'center', }}> {item.size_name === 'Standard' ? 'std' : item.size_name === 'Medium' ? 'M' : item.size_name == 'Large' ? 'X' : item.size_name}</Text>
                                                            </View>

                                                        </TouchableOpacity>


                                                    </View>
                                                )
                                            })}
                                        </View>
                                    </View>
                                )}
                            </View>

                            {/* -----------color selector--------------------------- */}
                            <View>

                                {(no_colorData == 'no data' && size_ID == 0) ? null : (
                                    <View style={{ flexDirection: 'column', alignItems: 'center', margin: 10 }}>
                                        <View>
                                            <Text style={{ color: 'black', fontSize: responsiveFontSize(2) }}>Your color :</Text>
                                        </View>

                                        <View>



                                            {

                                                colors && colors.map((item) => {
                                                    return (
                                                        <View >
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    setColorName(item.color_name);
                                                                    setColorID(item.color_id)
                                                                    setSelectRadio_color(item.color_id)
                                                                }}>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <View style={{ borderColor: '#000', borderWidth: 1, width: responsiveWidth(8), height: responsiveHeight(4), borderRadius: 30, margin: 5 }}>
                                                                        {selectRadio_color == item.color_id ? (
                                                                            <View style={{ backgroundColor: '#000', width: responsiveWidth(6), height: responsiveHeight(3), borderRadius: 30, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', margin: 3 }}></View>

                                                                        ) : null}
                                                                    </View>


                                                                    <Text style={{ color: '#000', fontSize: responsiveFontSize(2) }}>{item.color_name}</Text>
                                                                </View>

                                                            </TouchableOpacity>
                                                        </View>

                                                    )
                                                })

                                            }

                                        </View>
                                    </View>
                                )}
                            </View>

                        </View>
                        {/* ---------------------------------------------------------------------------------------- */}
                        <View style={{ backgroundColor: '#fff', width: responsiveWidth(95), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignSelf: 'center', borderRadius: 50, elevation: 10, shadowColor: '#000' }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: responsiveWidth(30), padding: 5 }}>


                                <TouchableOpacity disabled={quantity == 1} onPress={() => dec()} >
                                    <View style={{ alignSelf: 'center' }}>
                                        <Icon name="minus" color='black' size={22} />

                                    </View>
                                </TouchableOpacity>

                                <Text style={{ color: 'black', fontSize: 20 }}>{quantity}</Text>



                                {available_quantity && colorID >= 0 && size_ID >= 0 ? (
                                    <TouchableOpacity disabled={quantity == available_quantity} onPress={() => inc()}>

                                        <View style={{ alignSelf: 'center' }}>
                                            <Icon name="plus" color='black' size={22} />

                                        </View>
                                    </TouchableOpacity>
                                ) : (
                                    <View style={{ alignSelf: 'center' }}>
                                        <Icon name="plus" color='black' size={22} />

                                    </View>
                                )}

                            </View>
                            {/* ------------------------------------------------------------------------------------------- */}

                            {/* -----------btn------------- */}
                            <View style={{ width: responsiveWidth(65) }}>


                                {available_quantity && colorID >= 0 && size_ID >= 0 ? (


                                    <TouchableOpacity activeOpacity={0.8} onPress={() => { AddToCart() }} >
                                        <View style={{
                                            flexDirection: 'row', alignItems: 'center', backgroundColor: '#000',
                                            padding: 10, borderRadius: 50,
                                        }}>
                                            <Icon name="plus" color="white" size={22} />
                                            <Text style={{ color: 'white', marginLeft: 5, fontSize: responsiveFontSize(2.4) }}>
                                                Add to Cart
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ) : (
                                    <Animatable.View animation={'slideInLeft'} style={{
                                        flexDirection: 'row', alignItems: 'center', backgroundColor: '#000',
                                        padding: 10, borderRadius: 50,
                                    }}>
                                        <Icon name="plus" color="white" size={22} />
                                        <Text style={{ color: 'white', marginLeft: 5, fontSize: responsiveFontSize(2.4) }}>
                                            Add to Cart
                                        </Text>
                                    </Animatable.View>
                                )}
                            </View>
                        </View>


                    </Animatable.View>

                </View>

                <View style={{ padding: 30, }}>
                    <Text style={{ color: 'gray', fontSize: 16, textAlign: 'center' }}>Copyright© Cogent Dev Software solution.</Text>
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

export default ProductDetails;