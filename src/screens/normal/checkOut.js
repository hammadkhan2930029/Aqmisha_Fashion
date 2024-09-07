import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, RefreshControl, Button, Image, TextInput, BackHandler, ScrollView, FlatList, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from "react-native";
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
import { Formik, Form, Field } from 'formik';
import { object, string, number, date, InferType, Yup } from 'yup';
import LinearGradient from "react-native-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import AnimatedLoader from 'react-native-animated-loader';
import { useToast } from "react-native-toast-notifications";

import { RemoveItems } from '../Redux/actions';
const ShimmerView = createShimmerPlaceholder(LinearGradient)
const arry = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

// let checkout_form = object({
//     first_name: string()
//         .required("First Name is Required.")
//         .min(1, "First Name is Too Short."),
//     last_name: string()
//         .required("Last Name is Required.")
//         .min(1, "Last Name is Too Short."),
//     email: string()
//         .email('Please enter valid email')
//         .required('email in requird'),


//     address: string()
//         .required('Address must Requird'),
//     mobile_no: string()
//         .matches(/^(\+92|92|0)(\d{10})$/, 'Please enter a valid Pakistani mobile number')
//         .required('Mobile number is required'),

// });



const Checkout = (props) => {
    const toast = useToast();
    const navigation = useNavigation();
    const [viewCartData, setViewCartData] = useState();
    const [isloaded, setIsloaded] = useState(false);
    const [total, settotal] = useState();
    const [weight, setWeight] = useState();
    const [cart_lenght, setCart_lenght] = useState();
    const [user_id, setuser_id] = useState('');
    // -----------------Country API-----------------
    const [country, setCountry] = useState({ id: '0', name: '' })
    const [isClicked, setIsClicked] = useState(false)
    const [data, setData] = useState([])
    // ---------------City Api---------------------

    const [clicked, setClicked] = useState(false)
    const [city, setCity] = useState({ name: '', id: '0' })
    const [cityData, setCityData] = useState([])
    const [shippingfees, setShippingFees] = useState('0')
    const [visible, setVisible] = useState(false);
    const [user, setUser] = useState('');
    const [text, settext] = useState({ firstname: '', lastName: '', address: '', email: '', mob: '', city: '', country: '' })
    // ------------------AsyncStorage get data -------------------------
    const [userData, setUserData] = useState({
        name: '',
        email: '',
    });
    const randomNumber = useSelector(state => state.randomNumber.randomNumber);
    const [dis, setDis] = useState(true)

    const getMyObject = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('user_details')
            if (jsonValue != null) {
                const userDetails = JSON.parse(jsonValue);
                const firstUserId = userDetails.length > 0 ? userDetails[0].user_id : null;

                const n = userDetails.map((item) => {
                    console.log(item)
                    setUser(item)
                    setuser_id(item.user_id);
                    settext({
                        firstname: item.first_name,
                        lastName: item.last_name,
                        address: item.address,
                        mob: item.mobile_no,
                        city: item.city,
                        country: item.country,
                        email: item.email
                    });
                    if (item) {
                        setDis(false)
                    } else {
                        setDis(true)
                    }

                })

            } else (
                setuser_id(randomNumber)
            )
        } catch (e) {
            console.log('get object error' + e);
        }
    };



    // ------fetch add to cart list-------------------------------------------------


    const getAddtocart = async () => {
        setIsloaded(true)
        try {
            const url = `https://aqmishafashion.online/api/cart_api.php?cart=cart-products&user_id=${user_id}`;
            let response = await fetch(url)
            let result = await response.json()
                .then((result) => {

                    setCart_lenght(result.cart_count)

                    if (result.msg !== null) {
                        setViewCartData(result.msg)
                        const totalPrice = result.msg.map((item) => +item.price * item.quantity)
                        const total_weight = result.msg.map((item) => +item.weight)
                        settotal(totalPrice)
                        setWeight(total_weight)
                        setIsloaded(false)

                    } else {
                        setCart_lenght(null)
                        settotal(null)
                        setWeight(null)
                    }

                }).catch(error => console.log(error))


        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getMyObject();
        // arr()
        setTimeout(() => {

            getAddtocart()
        }, 200);
    }, [user_id, randomNumber])
    console.log('user', text)

    // --------------------------------------------------------------------------
    let sub_Total = total?.reduce((accum, curr) => {

        return accum + curr
    });
    let grandWeight = weight?.reduce((accum, curr) => {
        return accum + curr
    });
    // -----------------Country API-----------------------------------------

    const getCountry = async () => {

        try {

            const url = 'https://aqmishafashion.online/api/view_data_api.php?view=country';
            const countryApirespons = await fetch(url)
            const result = await countryApirespons.json()
                .then((result) => {
                    setData(result.msg)
                    console.log(result.msg)
                }).catch(error => console.log(error))
        } catch (error) {
            console.log('type Error', error)
        }
    }

    useEffect(() => {
        getCountry()
    }, [])


    // ---------------City Api----------------------------------------------


    const getCity = async (country_id) => {
        try {

            const url = `https://aqmishafashion.online/api/view_data_api.php?view=city&country_id=${country_id}`;
            let cityApirespons = await fetch(url);
            const result = await cityApirespons.json()
                .then((result) => {
                    setCityData(result.msg)
                }).catch((error) => {
                    console.log(error)
                })
        } catch (e) {
            console.log(e)
        }
    }
    console.log('country id', country.id, 'city id', city.id, 'gramd weight', grandWeight, 'sub total', sub_Total)

    //-----------------------Shipping Fee-------------------------------

    const shippingFee = async () => {
        try {
            const url = `https://aqmishafashion.online/api/view_data_api.php?view=get-shipping-fee&country_id=${country.id}&city_id=${city.id}&total_weight=${grandWeight}&sub_total_amount=${sub_Total}`
            const response = await fetch(url)
            const result = response.json()
                .then((result) => {
                    console.log(result.msg)
                    console.log('shiping', result.msg[0].shipping_fee)
                    if (result.msg[0].shipping_fee) {

                        setShippingFees(result.msg[0].shipping_fee)
                    } else (
                        setShippingFees('0')
                    )

                }).catch((er) => {
                    console.log('er', er)
                })

        } catch (error) {
            console.log('Error', error)
        }
    }
    useEffect(() => {
        shippingFee()
    }, [city.id])
    const grand = parseFloat(shippingfees) + parseFloat(sub_Total);


    // ----------Order place -------------------------------------------------



    const orderPlace = async (values) => {
        setVisible(true)
        console.log('values', values)
        var formData = new FormData();
        formData.append('user_id', user_id);
        formData.append('bfname', values.first_name || text.firstname);
        formData.append('blname', values.last_name || text.lastName);
        formData.append('bemail', values.email || text.email);
        formData.append('bmobile', values.mobile_no || text.mob);
        formData.append('baddress', values.address || text.address);
        formData.append('sub_total', sub_Total);
        formData.append('GrandTotal', grand);
        formData.append('GrandWeight', grandWeight)

        try {
            const url = `https://aqmishafashion.online/api/order_api.php?order=checkout`
            await fetch(url, {
                method: 'post',
                headers: {

                    'content-Type': 'application/json',
                    'content-Type': 'multipart/form-data',

                },
                body: formData
            }).then(response => response.json())
                .then((result) => {
                    console.log('result', result.msg[0].respons)
                    if (result.msg[0].response == 'order place successful') {

                        toast.show("Order placed successfully", {
                            type: "success",
                            placement: "top",
                            duration: 4000,
                            offset: 30,
                            animationType: "slide-in",
                        });
                        setVisible(false)
                        getAddtocart()
                        navigation.replace('main')
                    } else {
                        setVisible(false)
                        toast.show("Please fill this form", {
                            type: "warning",
                            placement: "top",
                            duration: 4000,
                            offset: 30,
                            animationType: "slide-in",
                        });
                    }

                })
                .catch((e) => {
                    console.log('error', e)
                })

        } catch (error) {
            console.log(error)
        }

    }


    const [refresh, setRefresh] = useState(false)
    const pullme = () => {
        setRefresh(true)
        getAddtocart()
        setTimeout(() => {
            setRefresh(false)
        }, 4000)
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                navigation.navigate('main');
                return true;
            }
        );

        return () => backHandler.remove();
    }, [navigation]);



    return (

        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
            <AnimatedLoader
                visible={visible}
                overlayColor="rgba(255,255,255,0.75)"
                animationStyle={{ width: 100, height: 100, }}
                speed={1}>
                <Text>Loading...</Text>
            </AnimatedLoader>
            <ScrollView
                style={{ paddingBottom: 10 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={() => pullme()} />
                }
            >
                <View>

                    <View>
                        <Text style={{ color: 'black', fontSize: responsiveFontSize(3), letterSpacing: 4, textAlign: 'center', padding: 10 }}>Order Place</Text>
                        <Image style={{ alignSelf: 'center' }} source={require('../../NewAssets/line.png')} />
                    </View>

                    {/* ------------CheckOut cards------------- */}
                    {isloaded ? (


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
                                                        width: responsiveWidth(98), flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', justifyContent: 'space-between', borderRadius: 10, marginTop: 5, shadowColor: "#000", padding: 6, shadowColor: "#000",
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 2,
                                                        },
                                                        shadowOpacity: 0.25,
                                                        shadowRadius: 3.84,
                                                        elevation: 5,
                                                    }}>
                                                        <View>
                                                            <Image style={{ resizeMode: 'contain', width: responsiveWidth(40), height: responsiveHeight(15) }} source={{ uri: item.product_image }} />
                                                        </View>
                                                        <View>
                                                            <View style={{ width: responsiveWidth(55), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 5, margin: 5 }}>
                                                                <View style={{ width: responsiveWidth(42) }}>
                                                                    <Text style={{ color: '#555555', fontSize: responsiveFontSize(2.8), fontWeight: '600' }}>{item.product_name}</Text>
                                                                </View>



                                                            </View>



                                                            <View style={{ flexDirection: 'column', justifyContent: 'space-between', width: responsiveWidth(40) }}>

                                                                <Text style={{ color: 'black', fontSize: responsiveFontSize(2.5), padding: 5 }}>{item.quantity ? "Qty : " + item.quantity : null}</Text>
                                                                <Text style={{ color: '#DD8560', fontSize: responsiveFontSize(2.5), fontWeight: '600', padding: 5 }}> {item.price ? "Price : " + item.price * item.quantity : null}</Text>

                                                            </View>


                                                        </View>

                                                    </View>


                                                </Animatable.View>
                                            ) : null}
                                        </View>

                                    )
                                })}
                        </View>


                    )}
                </View>
                {/* ----------------Add Shipping Adress Form--------------------- */}

                <View>
                    <Formik
                        initialValues={{
                            first_name: text.firstname || '',
                            last_name: text.lastName || '',
                            email: text.email || '',
                            address: text.address || '',
                            mobile_no: text.mob || '',
                        }}

                        validateOnMount={true}
                        onSubmit={(values, { resetForm }) => {
                            console.log('Values one', values)
                            orderPlace(values)
                            resetForm();

                        }}
                    >
                        {({ handleBlur, handleChange, values, touched, errors, isValid, handleSubmit }) => (


                            <View>
                                <Animatable.View animation={'flipInX'} style={{ padding: 10 }}>
                                    <Text style={{ color: 'black', fontSize: responsiveFontSize(2.5), textAlign: 'center' }}>ADD SHIPPING ADRESS</Text>
                                    <Image style={{ alignSelf: 'center' }} source={require('../../NewAssets/line.png')} />
                                </Animatable.View>

                                <Animatable.View animation={'slideInUp'} style={{ flexDirection: 'column', width: responsiveWidth(100), justifyContent: 'space-between', alignSelf: 'center' }}>


                                    <View style={{ width: responsiveWidth(90), alignSelf: 'center', marginTop: 15, marginBottom: 20 }}>
                                        <View>
                                            <TextInput
                                                style={style.inputstyle}
                                                placeholder={text.firstname || 'First Name'}
                                                placeholderTextColor={text.firstname ? 'black' : 'gray'}
                                                value={values.first_name || text.firstname}
                                                onChangeText={handleChange('first_name')}
                                                onBlur={handleBlur('first_name')}
                                                editable={dis}
                                            />
                                            <TextInput

                                                style={style.inputstyle}
                                                placeholder={text.lastName || 'Last Name'}
                                                placeholderTextColor={text.lastName ? 'black' : 'gray'}

                                                value={values.last_name || text.lastName}
                                                onChangeText={handleChange('last_name')}
                                                onBlur={handleBlur('last_name')}
                                                editable={dis}

                                            />
                                        </View>

                                        <View>
                                            <TextInput
                                                style={style.inputstyle}
                                                placeholder={text.email || 'email'}
                                                placeholderTextColor={text.email ? 'black' : 'gray'}

                                                value={values.email}
                                                onChangeText={handleChange('email')}
                                                onBlur={handleBlur('email')}
                                            />
                                        </View>
                                        <View>
                                            <TextInput
                                                style={style.inputstyle}
                                                placeholder={text.mob || 'Mobile no'}
                                                placeholderTextColor={text.mob ? 'black' : 'gray'}

                                                keyboardType='numaric'
                                                value={values.mobile_no}
                                                onChangeText={handleChange('mobile_no')}
                                                onBlur={handleBlur('mobile_no')}
                                            />
                                        </View>
                                        <View>
                                            <TextInput
                                                style={style.inputstyle}
                                                placeholder={text.address || "Address"}
                                                placeholderTextColor={text.address ? 'black' : 'gray'}

                                                numberOfLines={2}
                                                multiline={true}
                                                value={values.address}
                                                onChangeText={handleChange('address')}
                                                onBlur={handleBlur('address')}
                                            />
                                            <View>
                                                {/* ---------------country dropDown---------------  */}
                                                <TouchableOpacity style={style.dropDownSelector} onPress={() => { setIsClicked(!isClicked) }}>
                                                    <Text style={{ fontSize: responsiveFontSize(2), color: 'gray' }}>{country.name == '' ? text.country || 'Country' : country.name}</Text>
                                                    {isClicked ? <Icon name='arrow-down-drop-circle' color='gray' size={30} /> : <Icon color='gray' name='arrow-down-drop-circle-outline' size={30} />}

                                                </TouchableOpacity>

                                                {isClicked ? (<View style={style.dropDownAera}>
                                                    {

                                                        data?.map((item) => {
                                                            return (
                                                                <ScrollView>
                                                                    <View >
                                                                        <TouchableOpacity
                                                                            style={style.countriesItem}
                                                                            onPress={() => {
                                                                                setCountry({ name: item.country_name, id: item.country_id });
                                                                                setIsClicked(false)
                                                                                getCity(item.country_id)

                                                                            }}>

                                                                            <Text style={{ color: 'black', fontSize: responsiveFontSize(2) }}>{item.country_name}</Text>


                                                                        </TouchableOpacity>

                                                                    </View>
                                                                </ScrollView>
                                                            )
                                                        })

                                                    }

                                                </View>) : null}

                                                {/* ---------------City dropDown--------------- */}
                                                <TouchableOpacity style={style.dropDownSelector} onPress={() => { setClicked(!clicked) }}>
                                                    <Text style={{ fontSize: responsiveFontSize(2), color: 'gray' }}>{city.name == '' ? text.city || 'City' : city.name}</Text>
                                                    {clicked ? <Icon name='arrow-down-drop-circle' color='gray' size={30} /> : <Icon color='gray' name='arrow-down-drop-circle-outline' size={30} />}

                                                </TouchableOpacity>


                                                {clicked ? (<View style={style.dropDownAera}>

                                                    {

                                                        cityData?.map((item) => {
                                                            return (
                                                                <ScrollView>
                                                                    <View>
                                                                        <TouchableOpacity
                                                                            style={style.countriesItem}
                                                                            onPress={() => {
                                                                                setCity({ name: item.city_name, id: item.city_id });
                                                                                setClicked(false)
                                                                            }}>

                                                                            <Text style={{ color: 'black' }}>{item.city_name}</Text>

                                                                        </TouchableOpacity>

                                                                    </View>
                                                                </ScrollView>
                                                            )


                                                        })

                                                    }


                                                </View>) : null}
                                            </View>

                                        </View>





                                    </View>


                                </Animatable.View>
                                {cart_lenght ? (
                                    <View >

                                        <Animatable.View animation={'fadeInDown'} style={{ alignItems: 'center', justifyContent: 'center', width: responsiveWidth(95), alignSelf: 'center', backgroundColor: '#000', padding: 5, borderRadius: 10 }}>


                                            <Text style={{ fontSize: responsiveFontSize(2.5), padding: 5, color: '#fff', fontWeight: '500' }}>{'Sub Total  : ' + sub_Total}</Text>
                                            <Text style={{ fontSize: responsiveFontSize(2.5), padding: 5, color: '#fff', fontWeight: '500' }}>{'shipping Fees  : ' + shippingfees}</Text>
                                            <Text style={{ fontSize: responsiveFontSize(2.5), padding: 5, color: '#fff', fontWeight: '500' }}>{'Grand Total  : ' + grand}</Text>


                                        </Animatable.View>

                                    </View>
                                ) : null}

                                <TouchableOpacity onPress={handleSubmit}>
                                    <Animatable.View animation={'flipInY'} style={{
                                        width: responsiveWidth(95),
                                        backgroundColor: isValid ? '#000' : '#708090',
                                        padding: 15,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                        margin: 5,
                                        borderRadius: 10
                                    }}>
                                        <View>
                                            <Image source={require('../../NewAssets/apperal/bag2.png')} />
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: responsiveFontSize(2), paddingLeft: 5, letterSpacing: 3, color: 'white', fontWeight: '700' }}>PLACE ORDER</Text>
                                        </View>
                                    </Animatable.View>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>
                </View>


                {/* -----------falto----------------- */}
                <View style={{ height: responsiveHeight(10) }}>

                </View>

            </ScrollView>




        </SafeAreaView>
    )
};


const style = StyleSheet.create({
    // ------------Top navbar-----------
    TopNavbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: 'white',
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
    cartIcon: {
        marginLeft: 5
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
    inputstyle: {
        width: responsiveWidth(90),
        padding: 15,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        color: 'black'
    },
    dropDownSelector: {
        width: responsiveWidth(90),
        borderBottomWidth: .8,
        borderBottomColor: 'gray',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        padding: 15
    },
    dropDownAera: {
        width: responsiveWidth(90),
        borderRadius: 10,
        alignSelf: 'center',
        margin: 10,
        backgroundColor: 'white',
        padding: 10,
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
        width: responsiveWidth(90),
        padding: 10,
        alignSelf: 'center',
        justifyContent: 'center'
    },

});

export default Checkout;