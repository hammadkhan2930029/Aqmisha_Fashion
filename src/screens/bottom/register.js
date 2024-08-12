import React, { useEffect, useState, useRef } from "react";
import { Text, View, SafeAreaView, ScrollView, StyleSheet, FlatList, Platform, KeyboardAvoidingView, TextInput, TouchableOpacity, Image } from 'react-native'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from '@react-navigation/native';

import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import { PostRequst } from "./myAxiosRequest";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Formik, Form, Field } from 'formik';
import { object, string, number, date, InferType, Yup } from 'yup';
import * as Animatable from 'react-native-animatable';
import { useToast } from "react-native-toast-notifications";
import AnimatedLoader from 'react-native-animated-loader';
import AsyncStorage from "@react-native-async-storage/async-storage";



let user_register_foam = object({
    first_name: string()
        .required("First Name is Required.")
        .min(2, "First Name is Short."),
    last_name: string()
        .required("Last Name is Required.")
        .min(2, "Last Name is Short."),
    email: string()
        .email()
        .required("Email is Required."),
    password: string()
        .min(8, ({ min }) => `password must be at least ${min} characters long`)
        .required('Password is requird')

    ,
    confirm_password: string()
        .min(8, ({ min }) => `password must be at least ${min} characters long`)
        .required('Confirm Password ')

    ,
    mobile_no: string()
        .matches(/^(\+92|92|0)(\d{10})$/, 'Mobile Number is not valid')
        .required('Mobile number is required'),
    address: string()
        .required('Address must Requird'),
});

// ------------------------------------------------------------------------
const Register = ({ props }) => {
    const navigation = useNavigation();

    const toast = useToast();
    const [user_image, setUser_Image] = useState('');
    const [visible, setvisible] = useState(false);



    // -----------------------------------

    const imagepicker = async () => {
        let options = {
            storageOptions: {
                path: 'image',
            },
        }
        await launchImageLibrary(options, respons => {
            setUser_Image({
                uri: respons.assets[0].uri,
                name: respons.assets[0].fileName,
                filename: respons.assets[0].fileName,
                type: respons.assets[0].type
            })

        })
    }

    console.log("user image", user_image)


    // -----------------Country API-----------------
    const [country, setCountry] = useState("Select Country")
    const [isClicked, setIsClicked] = useState(false)
    const [data, setData] = useState([])
    const getCountry = async () => {

        try {

            const url = 'https://aqmishafashion.online/api/view_data_api.php?view=country';
            const countryApirespons = await fetch(url)
            const result = await countryApirespons.json()
                .then((result) => {
                    setData(result.msg)
                }).catch(error => console.log(error))
        } catch (error) {
            console.log('type Error', error)
        }
    }

    useEffect(() => {
        getCountry()
    }, [])


    // ---------------City Api---------------------

    const [clicked, setClicked] = useState(false)
    const [city, setCity] = useState("Select City")
    const [cityData, setCityData] = useState([])

    const getCity = async (country_id) => {

        const url = `https://aqmishafashion.online/api/view_data_api.php?view=city&country_id=${country_id}`;
        let cityApirespons = await fetch(url);
        cityApirespons = await cityApirespons.json();
        console.log(cityApirespons.msg);
        setCityData(cityApirespons.msg)
    }




    // -------Post data API--------->>>




    const post = async (values) => {
        setvisible(true)
        console.log(values)
        try {
            var formData = new FormData();
            formData.append('first_name', values.first_name);
            formData.append('last_name', values.last_name);
            formData.append('email', values.email);
            formData.append('password', values.password);
            formData.append('confirm_password', values.confirm_password);
            formData.append('user_image', user_image);
            formData.append('mobile_no', values.mobile_no);
            formData.append('country', country);
            formData.append('city', city);
            formData.append('address', values.address);


            const url = 'https://aqmishafashion.online/api/user_api.php?user=register'
            await fetch(url, {
                method: 'POST',
                headers: {

                    'content-Type': 'application/json',
                    'content-Type': 'multipart/form-data',

                },
                body: formData
            }).then((respons) => respons.json())
                .then(result => {
                    console.log('register ', result.msg[0].response)

                    if (result.msg[0].response == 'Email already exists') {
                        setvisible(false)

                        toast.show(result.msg[0].response, {
                            type: "warning",
                            placement: "top",
                            duration: 4000,
                            offset: 30,
                            animationType: "slide-in",
                        });



                    } else if (result.msg[0].response == 'register successful') {
                        setvisible(false)

                        toast.show("Registration successful", {
                            type: "success",
                            placement: "top",
                            duration: 4000,
                            offset: 30,
                            animationType: "slide-in",
                        });
                        setTimeout(() => {

                            navigation.replace('login')
                        }, 300);

                    }
                }).catch((e) => {
                    console.log('error api', e)
                })
        } catch (error) {
            console.log(error)
        }



    }




    return (
        <SafeAreaView style={{ backgroundColor: '#fff' }}>
            <AnimatedLoader
                visible={visible}
                overlayColor="rgba(255,255,255,0.75)"
                animationStyle={{ width: 100, height: 100, }}
                speed={1}>
                <Text>Loading...</Text>
            </AnimatedLoader>
            <ScrollView style={{ marginBottom: 20 }}>



                <Animatable.View animation={'fadeIn'} style={{ marginTop: 30 }}>
                    <Text style={{ color: 'black', fontSize: responsiveFontSize(4), textAlign: 'center', fontWeight: 'bold' }}>SIGN UP</Text>
                    <Image style={{ alignSelf: 'center' }} source={require('../../NewAssets/line.png')} />
                </Animatable.View>

                <Formik
                    initialValues={{ first_name: '', last_name: '', mobile_no: '', email: '', address: '', password: '', confirm_password: '' }}
                    onSubmit={(values, { resetForm }) => {
                        post(values)
                        resetForm();
                    }}
                    validationSchema={user_register_foam}
                    validateOnMount={true}
                    validate={(values) => {
                        const errors = {};
                        if (!values.password) {
                            errors.password = 'Password is required';
                        }
                        if (!values.confirm_password) {
                            errors.confirm_password = 'Confirm Password is required';
                        } else if (values.password !== values.confirm_password) {
                            errors.confirm_password = 'Passwords do not match';
                        }
                        return errors;
                    }}
                >
                    {({ handleBlur, handleChange, touched, errors, isValid, handleSubmit, values }) => (
                        <Animatable.View animation={'fadeInLeft'} style={{ flexDirection: 'column', width: responsiveWidth(100), justifyContent: 'space-between', alignSelf: 'center' }}>


                            <View style={{ width: responsiveWidth(90), alignSelf: 'center', marginTop: 15 }}>

                                <TextInput
                                    style={style.inputStyle}
                                    placeholder="First Name"
                                    placeholderTextColor="gray"
                                    value={values.first_name}
                                    onChangeText={handleChange('first_name')}
                                    onBlur={handleBlur('first_name')}

                                />

                                {(errors.first_name && touched.first_name) &&
                                    <Text style={{ color: 'red', padding: 5 }}>{errors.first_name}</Text>}

                                <TextInput

                                    style={style.inputStyle}
                                    placeholder="Last Name"
                                    placeholderTextColor="gray"
                                    value={values.last_name}
                                    onChangeText={handleChange('last_name')}
                                    onBlur={handleBlur('last_name')}

                                />
                                {(errors.last_name && touched.last_name) &&
                                    <Text style={{ color: 'red', padding: 5 }}>{errors.last_name}</Text>}


                                <TextInput
                                    style={style.inputStyle}
                                    placeholder="Email"
                                    placeholderTextColor="gray"
                                    value={values.email}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                />

                                {(errors.email && touched.email) &&
                                    <Text style={{ color: 'red', padding: 5 }}>{errors.email}</Text>}
                                <TextInput

                                    style={style.inputStyle}
                                    placeholder="Mobile Number"
                                    placeholderTextColor="gray"
                                    value={values.mobile_no}
                                    onChangeText={handleChange('mobile_no')}
                                    onBlur={handleBlur('mobile_no')}

                                />
                                {(errors.mobile_no && touched.mobile_no) &&
                                    <Text style={{ color: 'red', padding: 5 }}>{errors.mobile_no}</Text>}
                                {/* -------------------------------------------- */}


                                <TextInput

                                    style={style.inputStyle}
                                    placeholder="Address"
                                    placeholderTextColor="gray"
                                    value={values.address}
                                    numberOfLines={2}
                                    multiline={true}
                                    onChangeText={handleChange('address')}
                                    onBlur={handleBlur('address')}
                                />
                                {(errors.address && touched.address) &&
                                    <Text style={{ color: 'red', padding: 5 }}>{errors.address}</Text>}
                                {/* ---------------country dropDown--------------- */}
                                <TouchableOpacity style={style.dropDownSelector} onPress={() => { setIsClicked(!isClicked) }}>
                                    <Text style={{ fontSize: responsiveFontSize(2), color: 'gray' }}>{country == '' ? 'Select Country' : country}</Text>
                                    {isClicked ? <Icon name='arrow-down-drop-circle' color='gray' size={30} /> : <Icon color='gray' name='arrow-down-drop-circle-outline' size={30} />}

                                </TouchableOpacity>

                                {isClicked ? (<View style={style.dropDownAera}>
                                    {

                                        data?.map((item) => {
                                            return (
                                                <ScrollView>
                                                    <View>
                                                        <TouchableOpacity
                                                            style={style.countriesItem}
                                                            onPress={() => {
                                                                setCountry(item.country_name);
                                                                setIsClicked(false)
                                                                getCity(item.country_id)

                                                            }}>

                                                            <Animatable.Text style={{ color: 'black', fontSize: responsiveFontSize(2) }}>{item.country_name}</Animatable.Text>


                                                        </TouchableOpacity>

                                                    </View>
                                                </ScrollView>
                                            )
                                        })

                                    }

                                </View>) : null}

                                {/* ---------------City dropDown--------------- */}
                                <TouchableOpacity style={style.dropDownSelector} onPress={() => { setClicked(!clicked) }}>
                                    <Text style={{ fontSize: responsiveFontSize(2), color: 'gray' }}>{city == '' ? 'Select City' : city}</Text>
                                    {clicked ? <Icon name='arrow-down-drop-circle' color='gray' size={30} /> : <Icon color='gray' name='arrow-down-drop-circle-outline' size={30} />}

                                </TouchableOpacity>


                                {clicked ? (<View style={style.dropDownAera}>

                                    {

                                        cityData?.map((item) => {
                                            return (
                                                <ScrollView>
                                                    <View >
                                                        <TouchableOpacity
                                                            style={style.countriesItem}
                                                            onPress={() => {
                                                                setCity(item.city_name);
                                                                setClicked(false)
                                                            }}>

                                                            <Animatable.Text style={{ color: 'black' }}>{item.city_name}</Animatable.Text>

                                                        </TouchableOpacity>

                                                    </View>
                                                </ScrollView>
                                            )


                                        })

                                    }


                                </View>) : null}


                                {/* ---------------image picker---------------- */}
                                <View style={{ width: responsiveWidth(90), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderColor: 'gray', borderBottomWidth: .8, padding: 15 }}>
                                    <Text style={{ fontSize: responsiveFontSize(2), fontWeight: 'bold', color: 'gray' }}>UPLOAD PHOTO</Text>
                                    <TouchableOpacity onPress={() => imagepicker()}>
                                        <Icon name='plus' color='gray' size={30} />

                                    </TouchableOpacity>
                                </View>
                                {user_image ? (

                                    <View>
                                        <Image style={style.image} source={{ uri: user_image.uri }} />
                                    </View>
                                ) : null}




                                <TextInput

                                    style={style.inputStyle}
                                    placeholder="Password"
                                    placeholderTextColor="gray"
                                    secureTextEntry={true}
                                    value={values.password}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}


                                />
                                {(errors.password && touched.password) &&
                                    <Text style={{ color: 'red', padding: 5 }}>{errors.password}</Text>}
                                <TextInput
                                    style={style.inputStyle}
                                    placeholder="Set Password"
                                    placeholderTextColor="gray"
                                    secureTextEntry={true}
                                    value={values.confirm_password}
                                    onChangeText={handleChange('confirm_password')}
                                    onBlur={handleBlur('confirm_password')}
                                />

                                {(errors.confirm_password && touched.confirm_password) &&
                                    <Text style={{ color: 'red', padding: 5 }}>{errors.confirm_password}</Text>}


                            </View>


                            <TouchableOpacity onPress={handleSubmit} disabled={!isValid}>
                                <Animatable.View animation={'flipInY'} style={{
                                    width: responsiveWidth(95),
                                    backgroundColor: isValid ? 'black' : 'gray',
                                    padding: 15,
                                    marginTop: 20,
                                    borderRadius: 10,
                                    alignSelf: 'center'
                                }}>
                                    <View>
                                        <Text style={{ color: 'white', fontSize: responsiveFontSize(3), textAlign: 'center' }}>Sign Up</Text>
                                    </View>
                                </Animatable.View>
                            </TouchableOpacity>
                            {/* ------------------------------- */}
                        </Animatable.View>

                    )}
                </Formik>


            </ScrollView>

        </SafeAreaView >
    )
};
const style = StyleSheet.create({



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
    searchInput: {
        width: responsiveWidth(85),
        color: 'gray',
        borderRadius: 10,
        borderWidth: .6,
        borderColor: 'gray',
        alignSelf: 'center',
        margin: 10
    },

    inputStyle: {
        width: responsiveWidth(90),
        padding: 15,
        borderBottomColor: 'gray',
        borderBottomWidth: .5,
        color: 'black',
    },
    image: {
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: responsiveWidth(20),
        height: responsiveHeight(10),
        resizeMode: 'contain',
        borderRadius: 50,
        margin: 5
    }

});


export default Register;