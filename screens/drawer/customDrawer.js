import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Linking } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import { useNavigation } from '@react-navigation/native';
import { FlatList } from "react-native-gesture-handler";
import * as Animatable from 'react-native-animatable';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../../Config/baseUrl";



const CustomDrawer = (props) => {

    const navigation = useNavigation();
    const [user, setuser] = useState([]);

    // -------------------------------------------------------------------
    const getMyObject = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('user_details')
            if (jsonValue != null) {
                const userDetails = await JSON.parse(jsonValue);


                // console.log('custom',userDetails)
                setuser(userDetails)


            }
        } catch (e) {
            console.log('get object error' + e);
        }
    };

    useEffect(() => {
        getMyObject();

    }, []);

    // ------------------------category-------------
    const [CatData, setCatData] = useState([])
    const category = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/view_data_api.php?view=category`)
            const res = await response.json()
                .then((res) => {

                    setCatData(res.msg)
                }).catch((e) => console.log(e))

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        category()
    }, [])








    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ height: responsiveHeight(100), flexDirection: 'column', justifyContent: 'space-between' }}>

                <View>

                    <View>
                        {user.length !== 0 ? (
                            <View>

                                {user?.map((item, index) => {
                                    return (
                                        <View key={index}>
                                            {item.response == 'failed' ? (
                                                <View style={{
                                                    backgroundColor: ' #d4d4d4', shadowColor: "#000",
                                                    shadowOffset: {
                                                        width: 0,
                                                        height: 2,
                                                    },
                                                    shadowOpacity: 0.25,
                                                    shadowRadius: 3.84,
                                                    elevation: 5,
                                                    padding: 5,
                                                }}>
                                                    <View onPress={() => Linking.openURL(baseUrl)} style={{
                                                        width: responsiveWidth(20), height: responsiveHeight(10), borderRadius: 100, backgroundColor: 'white', shadowColor: "#000",
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 2,
                                                        },
                                                        shadowOpacity: 0.25,
                                                        shadowRadius: 3.84,
                                                        margin: 10,
                                                        elevation: 5,
                                                    }}>
                                                        <Image style={{ width: responsiveWidth(20), height: responsiveHeight(10) }} source={require('../../NewAssets/aqmisha.png')} />

                                                    </View>
                                                </View>
                                            ) : (

                                                <View style={{
                                                    backgroundColor: '#000', shadowColor: "#000",
                                                    shadowOffset: {
                                                        width: 0,
                                                        height: 2,
                                                    },
                                                    shadowOpacity: 0.25,
                                                    shadowRadius: 3.84,
                                                    padding: 5,
                                                    elevation: 5,
                                                }}>
                                                    <TouchableOpacity onPress={() => navigation.navigate('profile')}>

                                                        <Animatable.View animation={'flipInX'} style={{
                                                            width: responsiveWidth(20), height: responsiveHeight(10), borderRadius: 100, backgroundColor: 'white', shadowColor: "#000",
                                                            shadowOffset: {
                                                                width: 0,
                                                                height: 2,
                                                            },
                                                            shadowOpacity: 0.25,
                                                            shadowRadius: 3.84,
                                                            margin: 10,
                                                            elevation: 5,
                                                        }}>
                                                            <Image style={{ width: responsiveWidth(20), height: responsiveHeight(10), borderRadius: 100 }} source={{ uri: item.user_image }} />
                                                        </Animatable.View>
                                                        <View>
                                                            <Text style={{ color: '#fff', fontSize: responsiveFontSize(2.5), paddingLeft: 10 }}>{item.first_name + ' ' + item.last_name}</Text>
                                                            <Text style={{ color: '#C5C5C5', fontSize: responsiveFontSize(1.8), paddingLeft: 10 }}>{item.country + ' ' + item.city}</Text>



                                                        </View>
                                                    </TouchableOpacity>

                                                </View>
                                            )}

                                        </View>

                                    )
                                })}
                            </View>
                        ) : (
                            <View style={{
                                backgroundColor: '#d4d4d4', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                padding: 5,
                                elevation: 5,
                            }}>
                                <TouchableOpacity onPress={() => Linking.openURL('https://aqmishafashion.online/')}>

                                    <View style={{
                                        width: responsiveWidth(20), height: responsiveHeight(10), borderRadius: 100, backgroundColor: 'white', shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                        margin: 10,
                                        elevation: 5,
                                    }}>
                                        <Image style={{ width: responsiveWidth(20), height: responsiveHeight(10) }} source={require('../../NewAssets/aqmisha.png')} />

                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}




                    </View>
                    <View >
                        <TouchableOpacity activeOpacity={.6}
                            onPress={() => navigation.navigate('deals')}
                            style={{ paddingTop: 15, borderBottomColor: '#C5C5C5', borderBottomWidth: .8, flexDirection: 'row', alignItems: 'center' }}
                        >
                            <View>
                                <Image style={{ resizeMode: 'contain', width: responsiveWidth(8) }} source={require('../../NewAssets/apperal/Forward.png')} />
                            </View>

                            <Animatable.View animation={'fadeInDown'} >

                                <Text style={{ color: 'black', fontSize: responsiveFontSize(2.5), padding: 5 }} >Deals</Text>

                            </Animatable.View>
                            <View>
                                <Image style={{ resizeMode: 'contain', width: responsiveWidth(10), height: responsiveHeight(5) }} source={require('../../NewAssets/deal.png')} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.6}
                            onPress={() => navigation.navigate('shop')}
                            style={{ paddingTop: 15, borderBottomColor: '#C5C5C5', borderBottomWidth: .8, flexDirection: 'row', alignItems: 'center' }}
                        >

                            <View>
                                <Image style={{ resizeMode: 'contain', width: responsiveWidth(8) }} source={require('../../NewAssets/apperal/Forward.png')} />
                            </View>
                            <Animatable.View animation={'fadeInDown'} >

                                <Text style={{ color: 'black', fontSize: responsiveFontSize(2.5), padding: 5 }} >Shop</Text>

                            </Animatable.View>
                            <View>
                                <Image style={{ resizeMode: 'contain', width: responsiveWidth(10), height: responsiveHeight(5) }} source={require('../../NewAssets/shop.png')} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <FlatList
                            data={CatData}
                            keyExtractor={(item) => item.category_id}
                            renderItem={({ item }) => (
                                <View style={{ paddingTop: 15, borderBottomColor: '#C5C5C5', borderBottomWidth: .8 }}>
                                    <TouchableOpacity activeOpacity={.6} onPress={() => navigation.navigate('sub_category', { 'category_id': item.category_id, "category_name": item.category_name })}>
                                        <View style={{flexDirection:'row',alignItems:'center'}}>

                                            <View>
                                                <Image style={{ resizeMode: 'contain', width: responsiveWidth(8) }} source={require('../../NewAssets/apperal/Forward.png')} />
                                            </View>
                                            <Animatable.View animation={'fadeInDown'} >

                                                <Text style={{ color: 'black', fontSize: responsiveFontSize(2.5), padding: 5 }} >{item.category_name}</Text>

                                            </Animatable.View>
                                        </View>

                                    </TouchableOpacity>

                                </View>
                            )} />

                    </View>
                </View>
                <View >
                    <View style={{ padding: 10 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('aboute')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name='alert-circle-outline' size={25} color='#000' />

                            <Text style={{ color: 'black', fontSize: responsiveFontSize(2.5), padding: 10 }}>About us</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('contact')}>
                            <Icon name='contacts' size={25} color='#000' />

                            <Text style={{ color: 'black', fontSize: responsiveFontSize(2.5), padding: 10 }}>Contact us</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', padding: 10 }}>
                        <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/people/Aqmisha-The-Name-for-the-quality-fabrics/61552419902561/?mibextid=ZbWKwL')}>
                            <Icon name='facebook' size={30} color='#000' />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/aqmisha.bf/?utm_source=qr&igshid=MzNlNGNkZWQ4Mg%3D%3D')}>
                            <Icon name='instagram' size={30} color='#000' />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Linking.openURL('https://api.whatsapp.com/send/?phone=923203216788&text&type=phone_number&app_absent=0')}>
                            <Icon name='whatsapp' size={30} color='#000' />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ color: '#C5C5C5', fontSize: responsiveFontSize(1.8), padding: 10, textAlign: 'center' }}>Copyrights © 2024</Text>


                </View>
            </View>


        </SafeAreaView >

    )
};






export default CustomDrawer;