import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, TextInput, Image, ScrollView, BackHandler } from "react-native"
import Icon from 'react-native-vector-icons/MaterialIcons'
import NavbarTop from "./navbar";
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import { Formik, Form, Field } from 'formik';
import { object, string, number, date, InferType, Yup } from 'yup';
import * as Animatable from 'react-native-animatable';
import { useToast } from "react-native-toast-notifications";
import AnimatedLoader from 'react-native-animated-loader';
import { useNavigation } from "@react-navigation/native";


const Contact_us = () => {
    const navigation = useNavigation();
    const toast = useToast();
    const contact_Api = async (value) => {
        var formData = new FormData();
        formData.append("full_name", value.full_name);
        formData.append("email", value.email);
        formData.append("subject", value.subject);
        formData.append("message", value.message);

        try {
            const url = `https://aqmishafashion.online/api/contact_mail_api.php?contact=post`
            const response = await fetch(url, {
                method: 'post',
                headers: {
                    'content-Type': 'application/json',
                    'content-Type': 'multipart/form-data',

                },
                body: formData
            }).then((result) => result.json())
                .then((result) => {
                    if (result.msg) {
                        toast.show("Message sent successfully", {
                            type: "success",
                            placement: "top",
                            duration: 4000,
                            offset: 30,
                            animationType: "slide-in",
                        });
                    }
                    console.log(result)
                }).catch((error) => {
                    console.log('Api error', error)
                })


        } catch (error) {
            console.log('Try catch error', error)
        }
    }
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
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <NavbarTop />
            <ScrollView style={{ paddingBottom: 50 }}>
                <View>
                    <Animatable.View animation={'fadeIn'} style={{ marginTop: 30 }}>
                        <Text style={{ color: 'black', fontSize: responsiveFontSize(3), textAlign: 'center', fontWeight: 'bold' }}>Tell Us Your Message</Text>
                        <Image style={{ alignSelf: 'center' }} source={require('../../NewAssets/line.png')} />
                    </Animatable.View>
                    <View style={{ alignSelf: 'center' }}>
                        <Formik
                            initialValues={{ full_name: '', email: '', subject: '', message: '' }}
                            onSubmit={(values, { resetForm }) => {
                                console.log(values)
                                contact_Api(values);
                                resetForm();
                            }}
                            isInitialValid={true}>
                            {({ errors, isValid, handleBlur, handleChange, handleSubmit, touched, values }) => (
                                <View>


                                    <TextInput
                                        style={{
                                            width: responsiveWidth(90),
                                            padding: 15,
                                            borderBottomColor: 'gray',
                                            borderBottomWidth: .5,
                                            color: 'black',
                                        }}
                                        placeholder="Full Name"
                                        placeholderTextColor={'#C5C5C5'}
                                        value={values.full_name}
                                        onBlur={handleBlur('full_name')}
                                        onChangeText={handleChange('full_name')} />
                                    {(errors.full_name && touched.full_name) && <Text>{errors.full_name}</Text>}


                                    <TextInput
                                        style={{
                                            width: responsiveWidth(90),
                                            padding: 15,
                                            borderBottomColor: 'gray',
                                            borderBottomWidth: .5,
                                            color: 'black',
                                        }}
                                        placeholder="Email"
                                        placeholderTextColor={'#C5C5C5'}
                                        value={values.email}
                                        onBlur={handleBlur('email')}
                                        onChangeText={handleChange('email')} />
                                    {(errors.email && touched.email) && <Text>{errors.email}</Text>}

                                    <TextInput
                                        style={{
                                            width: responsiveWidth(90),
                                            padding: 15,
                                            borderBottomColor: 'gray',
                                            borderBottomWidth: .5,
                                            color: 'black',
                                        }}
                                        placeholder="Subject"
                                        placeholderTextColor={'#C5C5C5'}
                                        value={values.subject}
                                        onBlur={handleBlur('suject')}
                                        onChangeText={handleChange('subject')} />

                                    {(errors.subject && touched.subject) && <Text>{errors.subject}</Text>}

                                    <TextInput
                                        style={{
                                            width: responsiveWidth(90),
                                            padding: 15,
                                            borderBottomColor: 'gray',
                                            borderBottomWidth: .5,
                                            color: 'black',
                                        }}
                                        multiline={true}
                                        numberOfLines={4}
                                        placeholder="Message"
                                        placeholderTextColor={'#C5C5C5'}
                                        value={values.message}
                                        onBlur={handleBlur('message')}
                                        onChangeText={handleChange('message')} />
                                    {(errors.message && touched.message) && <Text>{errors.message}</Text>}


                                    <TouchableOpacity onPress={handleSubmit} disabled={!isValid} style={{
                                        width: responsiveWidth(90),
                                        backgroundColor: isValid ? 'black' : 'gray',
                                        padding: 10,
                                        borderRadius: 10,
                                        marginTop: 15
                                    }}>
                                        <Text style={{ color: '#fff', fontSize: responsiveFontSize(2.5), textAlign: 'center', fontWeight: 'bold', letterSpacing: 2 }}>SEND</Text>
                                    </TouchableOpacity>
                                </View>

                            )}

                        </Formik>

                    </View>
                    <View style={{ marginTop: 15 }}>
                        <View style={{ alignSelf: 'center', width: responsiveWidth(80), padding: 10 }}>
                            <Icon style={{ alignSelf: 'center' }} name='location-on' color='black' size={30} />
                            <Text style={{ fontSize: responsiveFontSize(1.8), color: "#000", padding: 5, textAlign: 'center' }}>
                                Address:
                                Plot No. 1009/1, Kapra Gali, Adamjee Road, Landhi, Karachi.</Text>
                        </View>
                        <View style={{ alignSelf: 'center', width: responsiveWidth(80), padding: 10 }}>
                            <Icon style={{ alignSelf: 'center' }} name='local-phone' color='black' size={30} />

                            <Text style={{ fontSize: responsiveFontSize(1.8), color: "#000", padding: 5, textAlign: 'center' }}>03319998780</Text>
                            <Text style={{ fontSize: responsiveFontSize(1.8), color: "#000", padding: 5, textAlign: 'center' }}>03203216788</Text>

                        </View>
                        <View style={{ alignSelf: 'center', width: responsiveWidth(80), padding: 10 }}>
                            <Icon style={{ alignSelf: 'center' }} name='email' color='black' size={30} />

                            <Text style={{ fontSize: responsiveFontSize(1.8), color: "#000", padding: 5, textAlign: 'center' }}>ab.bismillahfabrics@gmail.com</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Contact_us;