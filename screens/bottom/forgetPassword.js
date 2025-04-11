import React, { useState, useEffect } from "react";
import { Text, View, SafeAreaView, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from '@react-navigation/native';
import { baseUrl } from "../../Config/baseUrl";

import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import { Formik } from "formik";
import { object, string, number, date, InferType, Yup } from 'yup';
import { useToast } from "react-native-toast-notifications";

// -------------------------------------------
let loginValidation_schema = object({

    email: string()
        .email('Please enter valid email')
        .required('email in requird'),

});
// -----------------------------------------------
const ForgetPassword = () => {

    const navigation = useNavigation()
    const toast = useToast();
    

    const forgetPassword = async (values) => {

        var formData = new FormData();
        formData.append('email', values.email);
       


        const url = `${baseUrl}/api/user_api.php?user=forgot_password`;
        await fetch(url, {
            method: 'POST',
            headers: {

                'content-Type': 'application/json',
                'content-Type': 'multipart/form-data',

            },
            body: formData
        }).then(respons => respons.json())
            .then((result) => {
                console.log(result)
                toast.show(`Please check your email. We send you link to reset your password.`, {
                    type: "success",
                    placement: "top",
                    duration: 6000,
                    offset: 30,
                    animationType: "slide-in",
                });
                navigation.navigate("login")
            })
            .catch((e) => {
                console.log('error', e)
            })


    }


    return (

        <SafeAreaView style={{ backgroundColor: '#fff',flex:1 }}>

            <Formik
                initialValues={{ email: ''}}
                validateOnMount={true}
                validationSchema={loginValidation_schema}
                onSubmit={(values,{resetForm}) => {
                    forgetPassword(values);
                    resetForm();
                }}
                
            >
                {({ handleBlur, handleChange, isValid, handleSubmit, values, touched, errors }) => (


                    <View style={{ marginTop: 100 }}>

                        <View >
                            <Text style={{ color: 'black', fontSize: responsiveFontSize(4), textAlign: 'center', fontWeight: '900', padding: 30 }}>Forget Password</Text>
                        </View>


                        <View style={style.textinputStyle}>
                            <Icon name='email' color='black' size={30} />
                            <TextInput
                                style={style.input}
                                placeholder="Email"
                                placeholderTextColor="gray"
                                value={values.email}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}

                            />
                            <Icon name={!errors.email ? "check" : 'close'} style={{ color: !errors.email ? "black" : 'red' }} size={25} />
                        </View>

                        {(errors.email && touched.email) &&
                            <Text style={{ color: 'red', padding: 5 }}>{errors.email}</Text>}



                        <TouchableOpacity onPress={handleSubmit} disabled={!isValid}>
                            <View style={{
                                width: responsiveWidth(80),
                                backgroundColor: isValid ? '#000' : '#708090',
                                padding: 15,
                                marginTop: 20,
                                alignSelf: 'center',
                                borderRadius: 10,
                            }}>
                                <View>
                                    <Text style={{ color: 'white', fontSize: responsiveFontSize(3), textAlign: 'center',letterSpacing:4 }}>SEND</Text>
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
export default ForgetPassword;