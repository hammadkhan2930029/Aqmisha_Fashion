import React, { useState, useEffect } from "react";
import { Text, View, SafeAreaView, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, StyleSheet, BackHandler } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from '@react-navigation/native';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import { Formik } from "formik";
import { object, string, number, date, InferType, Yup } from 'yup';
import { useToast } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

// -------------------------------------------
let loginValidation_schema = object({



    current_password: string()
        .min(8, ({ min }) => `password must be at least ${min} characters`)
        .required('Password is requird')

    ,
    new_password: string()
        .min(8, ({ min }) => `password must be at least ${min} characters`)
        .required('Password is requird')

    ,
    confirm_password: string()
        .min(8, ({ min }) => `password must be at least ${min} characters`)
        .required('Password is requird')




});
// -----------------------------------------------
const Change_password = () => {

    const navigation = useNavigation()
    const toast = useToast();

    // const [showPassword, setShowpassword] = useState(true);
    // const [showPassword2, setShowpassword2] = useState(true);
    const [user, setuser] = useState()

    // ----------------------------------------------------------------------------
    const getMyObject = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('user_details')
            if (jsonValue != null) {
                const userDetails = JSON.parse(jsonValue);
                const firstUserId = userDetails.length > 0 ? userDetails[0].user_id : null;
                setuser(firstUserId);
            } else (
                setuser()
            )
        } catch (e) {
            console.log('get object error' + e);
        }
    };

    useEffect(() => {
        getMyObject();

    }, []);

    const change_password_2 = async (values) => {
        console.log(user);
        console.log(values);

        var formData = new FormData();
        formData.append('user_id', user);
        formData.append('current_password', values.current_password);
        formData.append('new_password', values.new_password);
        formData.append('confirm_password', values.confirm_password);


        const url = 'https://aqmishafashion.online/api/user_api.php?user=change_password';
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData
        })
            .then(response => {
                console.log("Response Status: ", response.status);
                return response.json();
            })
            .then((result) => {
                // console.log(result.msg[0].response);
                if (result.msg[0].response == 'password updated') {
                    toast.show(`Password changed successfully.`, {
                        type: "success",
                        placement: "top",
                        duration: 6000,
                        offset: 30,
                        animationType: "slide-in",
                    });
                    navigation.navigate("profile");
                }
                 else {
                    toast.show("Password change failed. Please try again.", {
                        type: "danger",
                        placement: "top",
                        duration: 6000,
                        offset: 30,
                        animationType: "slide-in",
                    });
                }
            })
            .catch((e) => {
                console.log('error', e);
                toast.show("An error occurred. Please try again.", {
                    type: "danger",
                    placement: "top",
                    duration: 6000,
                    offset: 30,
                    animationType: "slide-in",
                });
            });
    }

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

        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>

            <Formik
                initialValues={{ current_password: '', new_password: '', confirm_password: '' }}
                validateOnMount={true}
                validationSchema={loginValidation_schema}
                onSubmit={(values, { resetForm }) => {
                    change_password_2(values);
                    resetForm();
                }}
                validate={(values) => {
                    const errors = {};
                    if (!values.new_password) {
                        errors.new_password = 'Password is required';
                    }
                    if (!values.confirm_password) {
                        errors.confirm_password = 'Confirm Password is required';
                    } else if (values.new_password !== values.confirm_password) {
                        errors.confirm_password = 'Passwords do not match';
                    }
                    return errors;
                }}
            >
                {({ handleBlur, handleChange, isValid, handleSubmit, values, touched, errors }) => (


                    <View style={{ marginTop: 100 }}>

                        <View >
                            <Text style={{ color: 'black', fontSize: responsiveFontSize(4), textAlign: 'center', fontWeight: '900', padding: 30 }}>Change Password</Text>
                        </View>


                        <View style={style.textinputStyle}>
                            <Icon name='lock' color='black' size={30} />
                            <TextInput
                                style={style.input}
                                placeholder="current Password"
                                placeholderTextColor="gray"
                                value={values.current_password}
                                secureTextEntry={true}
                                onChangeText={handleChange('current_password')}
                                onBlur={handleBlur('current_password')}
                            />

                        </View>

                        {(errors.current_password && touched.current_password) &&
                            <Text style={{ color: 'red', padding: 5 }}>{errors.current_password}</Text>}


                        <View style={style.textinputStyle}>
                            <Icon name='lock' color='black' size={30} />
                            <TextInput
                                style={style.input}
                                placeholder="New Password"
                                placeholderTextColor="gray"
                                value={values.new_password}
                                secureTextEntry={true}
                                onChangeText={handleChange('new_password')}
                                onBlur={handleBlur('new_password')}
                            />

                        </View>

                        {(errors.new_password && touched.new_password) &&
                            <Text style={{ color: 'red', padding: 5 }}>{errors.new_password}</Text>}


                        <View style={style.textinputStyle}>
                            <Icon name='lock' color='black' size={30} />
                            <TextInput
                                style={style.input}
                                placeholder="Confirm Password"
                                placeholderTextColor="gray"
                                value={values.confirm_password}
                                secureTextEntry={true}
                                onChangeText={handleChange('confirm_password')}
                                onBlur={handleBlur('confirm_password')}
                            />

                        </View>

                        {(errors.confirm_password && touched.confirm_password) &&
                            <Text style={{ color: 'red', padding: 5 }}>{errors.confirm_password}</Text>}

                        <TouchableOpacity onPress={handleSubmit} disabled={!isValid}>
                            <View style={{
                                width: responsiveWidth(80),
                                backgroundColor: isValid ? 'black' : 'gray',
                                padding: 15,
                                marginTop: 20,
                                alignSelf: 'center',
                                borderRadius: 10,
                            }}>
                                <View>
                                    <Text style={{ color: 'white', fontSize: responsiveFontSize(3), textAlign: 'center', letterSpacing: 4 }}>SEND</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                    </View>
                )}
            </Formik>
        </SafeAreaView>


    )
}
const style = StyleSheet.create({
    textinputStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        alignSelf: 'center',
        width: responsiveWidth(90)
    },
    input: {
        width: responsiveWidth(80),
        padding: 15,
        borderBottomColor: 'gray',
        borderBottomWidth: .5,
        color: 'gray',
        alignSelf: 'center'
    }
})
export default Change_password;