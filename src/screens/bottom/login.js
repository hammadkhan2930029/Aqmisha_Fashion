import React, { useState, useEffect } from "react";
import { Text, View, SafeAreaView, TextInput, Modal, TouchableOpacity, StatusBar, BackHandler, Platform, KeyboardAvoidingView, } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from '@react-navigation/native';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from "react-redux";
import { AddUser } from "../Redux/actions";
import * as Animatable from 'react-native-animatable';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik } from "formik";
import { object, string, number, date, InferType } from 'yup';
import AnotherIcon from 'react-native-vector-icons/MaterialIcons';
import { useToast } from "react-native-toast-notifications";
import AnimatedLoader from 'react-native-animated-loader';


let loginValidation_schema = object({

    email: string()
        .email('Please enter valid email')
        .required('email in requird'),

    password: string()
        .min(8, ({ min }) => `password must be at least ${min} characters`)
        .required('Password is requird')



});

const LogIn = () => {
    const navigation = useNavigation();
    const toast = useToast();
    const [visible, setvisible] = useState(false);
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
    // --------------------------------aycnsStorage get data------------------------------------------
    const [user_id, setuser_id] = useState(0);
    // const [user_email, setuser_email] = useState(0);


    const getMyObject = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('user_details')
            if (jsonValue != null) {
                const userDetails = JSON.parse(jsonValue);
              
                // const firstUserId = userDetails.length > 0 ? userDetails[0].user_id : null;
               const map = userDetails.map((item)=>{

                   setuser_id(item.user_id);
                   console.log('Item',item.user_id)
               })
                
            }
        } catch (e) {
            console.log('get object error' + e);
        }
    };

    useEffect(() => {
        getMyObject();

    }, []);
    // ----------------------------------------------------------------
    console.log('user id',user_id)

    // useEffect(() => {
    //     if (user_id) {
    //         console.log('profile');
    //         navigation.replace('profile');

    //     } else {
    //         console.log('login');


    //     }
    //     setTimeout(() => {

    //         setvisible(false)
    //     }, 500);
    // }, [user_id]);

    // --------------AysncStorage Set Data------------------------
    const setObjectValue = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('user_details', jsonValue)
            console.log('Done.')

        } catch (e) {
            console.log('set object error', e)

        }

    }




    // ----------------------Log in Api----------------------------------

    const [showPassword, setShowpassword] = useState(true)

    const loginRequst = async (values) => {
        setvisible(true)
        try {

            const url = `https://aqmishafashion.online/api/user_api.php?user=login&email=${values.email}&password=${values.password}`
            const respons = await fetch(url)
            let result = await respons.json()
                .then((result) => {
                    console.log('response', result.msg)
                    setObjectValue(result.msg)
                    if (result.msg[0].user_id) {
                        toast.show("Successfully login", {
                            type: "success",
                            placement: "top",
                            duration: 4000,
                            offset: 30,
                            animationType: "slide-in",
                        });
                        navigation.replace('profile')
                        setvisible(false)

                    } else if(result.msg[0].response == 'failed') {
                        toast.show("Email/password not valid", {
                            type: "warning",
                            placement: "top",
                            duration: 4000,
                            offset: 30,
                            animationType: "slide-in",
                        });
                        setvisible(false)


                    }

                })

                .catch((error) => {
                    console.log('API error', error)
                })

        } catch (error) {
            console.log('error', error)
        }


    };
    

    return (
        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
            <AnimatedLoader
                visible={visible}
                overlayColor="rgba(255,255,255,1)"
                animationStyle={{ width: 100, height: 100, }}
                speed={1}>
                <Text>Loading...</Text>
            </AnimatedLoader>

            <StatusBar
                animated={true}
                backgroundColor='#fff'
                barStyle={'dark-content'}
                showHideTransition={'fade'}

            />
            {/* <TouchableOpacity activeOpacity={.5} onPress={() => navigation.navigate('main')}>
                <View style={{
                    marginTop: 30,
                    marginLeft: 10

                }}>
                    <AnotherIcon name='arrow-back' size={30} color='gray' />
                </View>
            </TouchableOpacity> */}


            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                {/* <ScrollView> */}

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validateOnMount={true}
                    onSubmit={(values, { resetForm }) => {
                        loginRequst(values)
                        resetForm();

                    }}
                    validationSchema={loginValidation_schema}>
                    {({ handleChange, handleBlur, handleSubmit, values, touched, errors, isValid }) => (


                        <View>

                            <View style={{ marginTop: 70 }}>
                                <Animatable.Text animation={'zoomIn'} style={{ color: 'black', fontSize: responsiveFontSize(5), textAlign: 'center', fontWeight: '900', padding: 30 }}>LOG IN</Animatable.Text>
                            </View>

                            < Animatable.View animation={'slideInLeft'} style={{ width: responsiveWidth(90), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', alignSelf: 'center' }}>
                                <Icon name='email' color='black' size={30} />
                                <TextInput
                                    style={{ width: responsiveWidth(75), padding: 15, borderBottomColor: 'gray', borderBottomWidth: 1, color: 'gray', }}
                                    placeholder="Email"
                                    placeholderTextColor="gray"
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}

                                />

                                <Icon name={!errors.email ? 'check' : "close"} style={{ color: !errors.email ? "black" : 'red' }} size={25} />

                            </Animatable.View>

                            {(errors.email && touched.email) &&
                                <Text style={{ color: 'red', marginLeft: 40, padding: 5 }}>{errors.email}</Text>
                            }

                            <Animatable.View animation={'slideInLeft'} style={{ width: responsiveWidth(90), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', alignSelf: 'center' }}>
                                <Icon name='lock' color='black' size={30} />
                                <TextInput
                                    style={{ width: responsiveWidth(75), padding: 15, borderBottomColor: 'gray', borderBottomWidth: 1, color: 'gray' }}
                                    placeholder="Password"
                                    placeholderTextColor="gray"
                                    secureTextEntry={showPassword}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}

                                />
                                <Icon name='eye' color='black' size={25} onPress={() => setShowpassword(!showPassword)} />

                            </Animatable.View>
                            {(errors.password && touched.password) &&
                                <Text style={{ color: 'red', marginLeft: 40, padding: 5 }}>{errors.password}</Text>
                            }
                            <TouchableOpacity onPress={() => navigation.navigate('forget')}>
                                <Animatable.View animation={'slideInRight'} style={{ alignItems: 'flex-end' }}>
                                    <Text style={{ color: 'black', fontSize: responsiveFontSize(1.8), padding: 10 }}>Forget Password</Text>
                                </Animatable.View>
                            </TouchableOpacity>

                            <TouchableOpacity disabled={!isValid} onPress={handleSubmit}>
                                <Animatable.View animation={'slideInLeft'} style={{
                                    width: responsiveWidth(80),
                                    backgroundColor: isValid ? 'black' : 'gray',
                                    padding: 15,
                                    marginTop: 20,
                                    alignSelf: 'center',
                                    borderRadius: 10,
                                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center'

                                }}>
                                    <View>
                                        <Text style={{ color: 'white', fontSize: responsiveFontSize(3), textAlign: 'center' }}>LOG IN</Text>

                                    </View>


                                </Animatable.View>
                            </TouchableOpacity>


                            <Animatable.View animation={'slideInUp'} style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', paddingTop: 20 }}>
                                <Text style={{ color: 'black', fontSize: responsiveFontSize(2) }}>Don't have an account !</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('register')}>
                                    <Text style={{ color: 'blue', fontSize: responsiveFontSize(2) }}> Register Now </Text>

                                </TouchableOpacity>
                            </Animatable.View>

                        </View>
                    )}
                </Formik>


                {/* </ScrollView> */}
            </KeyboardAvoidingView>


        </SafeAreaView>
    )
}
export default LogIn;