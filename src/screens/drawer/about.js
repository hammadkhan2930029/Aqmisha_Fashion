import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ImageBackground, ScrollView, FlatList, } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
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
            const url = `https://demo.cogentecommerce.com/api/view_data_api.php?view=about`
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
                <View style={{ alignSelf: 'center', width: responsiveWidth(95), marginTop: 10, marginBottom: 10 }}>
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
                </View>




                {/* ------------Bottom---------------- */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 15 }}>
                    <Icon name='twitter' color='black' size={40} />
                    <Icon name='instagram' color='black' size={40} />
                    <Icon name='facebook' color='black' size={40} />
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