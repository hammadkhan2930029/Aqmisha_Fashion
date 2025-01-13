import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Linking, ImageBackground, ScrollView, FlatList, } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import NavbarTop from './navbar';
import * as Animatable from 'react-native-animatable';
import AnimatedLoader from 'react-native-animated-loader';
import { useToast } from "react-native-toast-notifications";
import LinearGradient from "react-native-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

const ShimmerView = createShimmerPlaceholder(LinearGradient);

const About = () => {

    const navigation = useNavigation();
    const [data, setdata] = useState([])
    const [visible, setVisible] = useState(true)
    // const [loader,setLoader]=useState(true)
    const about = async () => {
        try {
            const url = `https://aqmishafashion.online/api/view_data_api.php?view=about`
            const response = await fetch(url)
            const result = await response.json()
                .then((result) => {

                    setdata(result.msg)
                    if (result.msg) {
                        setVisible(false)
                        // setLoader(false)
                    }
                }).catch((e) => {
                    toast.show("Data not found", {
                        type: "warning",
                        placement: "top",
                        duration: 4000,
                        offset: 30,
                        animationType: "slide-in",
                    });
                    setVisible(false)

                })

        } catch (errors) {
            console.log('try catch error', errors)
        }
    }
    useEffect(() => {
        about();
    }, [])



    if (!data) {
        return <Text>Loading...</Text>;
    }
    console.log(data)

    return (
        // ---------------Top Navbar-----------------
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <AnimatedLoader
                visible={visible}
                overlayColor="rgba(255,255,255,1)"
                animationStyle={{ width: 100, height: 100, }}
                speed={1}>
                <Text>Loading...</Text>
            </AnimatedLoader>
            <View>
                <NavbarTop />
            </View>
            <ScrollView>
                {/* <View style={{ alignSelf: 'center', width: responsiveWidth(95), marginTop: 10, marginBottom: 10 }}>
                    {data.map((item, index) => {
                        console.log('item', item);
                        switch (item.sec_condition) {
                            case "1": // Only Text
                                return (
                                    <Animatable.View animation={'fadeInDown'} key={index}>
                                        <Text style={{ color: '#000', fontSize: responsiveFontSize(2.5), fontWeight: '700' }}>{item.desc_title}</Text>
                                        <Text style={{ color: '#000', fontSize: responsiveFontSize(2), padding: 10 }}>{item.description}</Text>
                                    </Animatable.View>
                                );
                            case "2": // Only Image
                                return (
                                    <View key={index}>
                                        
                                            <Animatable.Image animation={'fadeInDown'}
                                                source={{ uri: item.image }}
                                                style={{
                                                    width: responsiveWidth(90), height: responsiveHeight(20), alignSelf: 'center', padding: 10, shadowColor: "#000",
                                                    shadowOffset: {
                                                        width: 0,
                                                        height: 2,
                                                    },
                                                    shadowOpacity: 0.25,
                                                    shadowRadius: 3.84,
                                                    backgroundColor: '#fff',
                                                    elevation: 5,
                                                    borderRadius: 10
                                                }}
                                            />
                                  
                                    </View>
                                );
                            case "3": // Text - Image
                                return (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: responsiveWidth(95), marginTop: 10 }} key={index}>
                                        <Animatable.View animation={'fadeInLeft'} style={{ width: responsiveWidth(45), height: responsiveHeight(50), }}>

                                            <Text style={{ color: '#000', fontSize: responsiveFontSize(2.5), fontWeight: '700' }}>{item.desc_title}</Text>
                                            <Text style={{ color: '#000', fontSize: responsiveFontSize(1.5), padding: 5 }}>{item.description}</Text>
                                        </Animatable.View>
                                        <Animatable.Image animation={'fadeInRight'}
                                            source={{ uri: item.image }}
                                            style={{ width: responsiveWidth(50), resizeMode: 'contain', height: responsiveHeight(50), alignSelf: 'center' }}
                                        />
                                    </View>
                                );
                            case "4": // Image - Text
                                return (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: responsiveWidth(95), marginTop: 10 }} key={index}>
                                        <Animatable.Image animation={'fadeInLeft'}
                                            source={{ uri: item.image }}
                                            style={{ width: responsiveWidth(50), resizeMode: 'contain', height: responsiveHeight(50), alignSelf: 'center' }}
                                        />
                                        < Animatable.View animation={'fadeInRight'} style={{ width: responsiveWidth(45), height: responsiveHeight(50), }}>

                                            <Text style={{ color: '#000', fontSize: responsiveFontSize(2.5), fontWeight: '700', }}>{item.desc_title}</Text>
                                            <Text style={{ color: '#000', fontSize: responsiveFontSize(2), padding: 5 }}>{item.description}</Text>
                                        </Animatable.View>
                                    </View>
                                );
                            case "5": // Text - Text
                                return (
                                    <Animatable.View animation={'fadeInUpBig'} key={index}>
                                        <Text style={{ color: '#000', fontSize: responsiveFontSize(2.5), fontWeight: '700', marginTop: 10 }}>{item.desc_title}</Text>
                                        <Text style={{ color: '#000', fontSize: responsiveFontSize(2), padding: 10 }}>{item.description}</Text>
                                        <Text style={{ color: '#000', fontSize: responsiveFontSize(2.5), fontWeight: '700', marginTop: 10 }}>{item.decs_title_2}</Text>
                                        <Text style={{ color: '#000', fontSize: responsiveFontSize(2), padding: 10 }}>{item.description_2}</Text>
                                    </Animatable.View>
                                );
                            case "6": // Image - Image
                                return (
                                    <View key={index}>
                                        <Image
                                            source={{ uri: item.image }}
                                            style={{ width: responsiveWidth(90), height: responsiveHeight(20), alignSelf: 'center', marginTop: 10 }}
                                        />
                                        <Image
                                            source={{ uri: item.image_2 }}
                                            style={{ width: responsiveWidth(90), height: responsiveHeight(20), alignSelf: 'center', marginTop: 10 }}
                                        />
                                    </View>
                                );
                            default:
                                return null;
                        }
                    })}
                </View> */}
                <View style={{ width: responsiveWidth(95), alignSelf: 'center' }}>

                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {/* <Icon name='eye' size={20} color='#000' /> */}
                            <Text style={{ fontSize: responsiveFontSize(2.5), color: '#000', fontWeight: '700', padding: 5 }}>Vision</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: responsiveFontSize(2), color: '#000', padding: 5 }}>We aim to be the go-to place for anyone who loves unique and stylish fashion in clothing and home textiles. Aqmisha Fashion dreams of a world where our special collection brings people together, celebrating the beauty of various designs and cultures.</Text>
                        </View>
                    </View>

                    {/* ---------------------------------- */}
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {/* <Icon name='eye' size={20} color='#000' /> */}
                            <Text style={{ fontSize: responsiveFontSize(2.5), color: '#000', fontWeight: '700', padding: 5 }}>Mission</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: responsiveFontSize(2), color: '#000', padding: 5 }}>At Aqmisha Fashion, our goal is to help people show their special style through carefully chosen fashion in clothing and home textiles. We want to offer a variety of high-quality items, embracing the wonderful traditions of various styles and cultures. By giving great service and always trying to do our best, we want to make shopping here a fun experience that shows off the elegance and uniqueness of each person.</Text>
                        </View>
                    </View>
                    {/* ---------------------------------- */}
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {/* <Icon name='eye' size={20} color='#000' /> */}
                            <Text style={{ fontSize: responsiveFontSize(2.5), color: '#000', fontWeight: '700', padding: 5 }}> Quality Policy</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: responsiveFontSize(2), color: '#000', padding: 5 }}>We aim to serve our customers top-notch products made with quality fabrics.</Text>
                        </View>
                    </View>
                    {/* ---------------------------------- */}
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image  style={{resizeMode:'contain',height:responsiveHeight(50),width:responsiveWidth(95),alignSelf:'center'}} source={require('../../NewAssets/about_1.png')} />
                        </View>
                        <View>
                            <Text style={{ fontSize: responsiveFontSize(2), color: '#000', padding: 5 }}>
                                Dear Valued Customers,{'\n'}

                                I'm Adeel Aslam, the proud Co-owner of Aqmisha and a Textile Engineering graduate. I extend sincere gratitude for being part of our journey. At Aqmisha, we prioritize quality in every product, leveraging my expertise to ensure excellence in craftsmanship. Your satisfaction is our commitment, and we look forward to continually providing you with exceptional products that reflect our unwavering belief in quality.{'\n'}

                                Warm regards,{'\n'}

                                Adeel Aslam{'\n'}
                                Co-Owner, Aqmisha</Text>
                        </View>
                    </View>
                    {/* ---------------------------------- */}
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{resizeMode:'contain',height:responsiveHeight(50),width:responsiveWidth(95),alignSelf:'center'}} source={require('../../NewAssets/about_2.png')}/>

                        </View>
                        <View>
                            <Text style={{ fontSize: responsiveFontSize(2), color: '#000', padding: 5 }}>
                                Dear Valued Customers,{'\n'}

                                I'm Bashir Ahmad, Co-owner of Aqmisha, bringing 22 years of invaluable experience in the textile industry. I appreciate your trust in our brand. At Aqmisha, we are dedicated to delivering products of the highest quality, infused with years of expertise. Your satisfaction is our utmost priority, and we eagerly anticipate providing you with outstanding products that showcase our dedication to excellence.{'\n'}

                                Warm regards,{'\n'}

                                Bashir Ahmad{'\n'}
                                Co-Owner, Aqmisha</Text>
                        </View>
                    </View>

                </View>




                {/* ------------Bottom---------------- */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 15 }}>
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





            </ScrollView>

        </SafeAreaView >
    )
};
const style = StyleSheet.create({
    // ------------Top navbar-----------
    TopNavbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
        backgroundColor: '#FFFFFF',
        padding: 10,
        width: responsiveWidth(100)

    },
    SearchAndCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '12%'

    },
    searchIcon: {
        marginRight: 2
    },
    cartIcon: {
        marginRight: 5

    },

    logoImage: {
        resizeMode: 'contain',
        width: 80,
        height: 50
    },

});

export default About;