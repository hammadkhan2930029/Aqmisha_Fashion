import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, View, StatusBar, StyleSheet, TouchableOpacity, Image, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
    responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import * as Animatable from 'react-native-animatable';
import NavbarTop from "./navbar";
import { ScrollView } from "react-native-gesture-handler";
import LinearGradient from "react-native-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

const ShimmerView = createShimmerPlaceholder(LinearGradient)
const arry = [1, 1, 1, 1]



export const Sub_subCategory = (props) => {
    const navigation = useNavigation();
    const { category_id, category_name, sub_category_name, sub_category_id } = props.route.params


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
    console.log(props.route.params)

    //---------------------------------------------
    const [brandData, setbrandData] = useState([]);
    //--------------------------------------
    const [productData, setProductData] = useState([]);
    const [isLoaded, setIsloaded] = useState(true)
    // ----------Sub Category---------------------
    const [sub_subCatData, setSub_subCatData] = useState([])
    const [id, setid] = useState([]);

    const sub_subCategory = async () => {

        try {
            const response = await fetch(`https://demo.cogentecommerce.com/api/view_data_api.php?view=sub-sub-category&category_id=${category_id}&sub_category_id=${sub_category_id}`)
            const res = await response.json()
                .then((res) => {
                    const sub_sub_id = res.msg.map((item) => +item.sub_sub_category_id)
                    setSub_subCatData(res.msg)
                    console.log('res', res.msg)
                    setid(sub_sub_id)
                }).catch(error => console.log(error))


        } catch (error) {
            console.log(error);
        }

    }
    useEffect(() => {
        sub_subCategory()
    }, [sub_category_id])
    // ------------------brand Api--------------------
    const brandApi = async () => {
        try {

            const response = await fetch(`https://demo.cogentecommerce.com/api/view_data_api.php?view=brand`)
            const result = await response.json()
                .then((result) => {
                    result.msg.map((item) => {
                        setbrandData(item.brand_id)
                    })

                })
                .catch(error => console.log(error))

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        brandApi()
    }, [])
    //----------------------Product Api-----------------------------------


    const product = async () => {

        try {

            const response = await fetch(`https://demo.cogentecommerce.com/api/view_data_api.php?view=products&category_id=${category_id}&sub_category_id=${sub_category_id}&sub_sub_category_id=${id}&brand_id=${brandData}`)

            const result = await response.json()
                .then((result) => {
                    console.log(result.msg)
                    setProductData(result.msg);
                    setIsloaded(false)

                }).catch((error) => {
                    console.log(error)
                    setIsloaded(false)

                })


        } catch (error) {
            console.log('E', error)
        }
    }
    useEffect(() => {
        product()
    }, [id])
    useFocusEffect(
        React.useCallback(() => {
            product();
        }, [])
    );
    let iconName;
    
    return (
        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>

            <Animatable.View animation={'slideInDown'}>
                <NavbarTop />
            </Animatable.View>
            <ScrollView>

                <View>
                    <Text style={{ fontSize: responsiveFontSize(2.5), padding: 10, color: 'black' }}>{category_name + " > " + sub_category_name}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', width: responsiveWidth(100) }}>

                    {sub_subCatData?.map((item, index) => {
                        console.log(item)

                        return (
                            <View style={{ margin: 10 }} key={index}>
                                <View style={{
                                    backgroundColor: 'white', width: responsiveWidth(16), height: responsiveHeight(8), borderRadius: 50, shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    padding: 10,
                                    elevation: 5,
                                    alignSelf: 'center'
                                }}>

                                    <Icon style={{ alignSelf: 'center' }} name='cloud-question' color='black' size={40} />
                                </View>

                                <Text style={{ fontSize: responsiveFontSize(2), color: 'black', fontWeight: '600', textAlign: 'center' }}>{item.sub_sub_category_name || 'data not found'}</Text>
                            </View>
                        )
                    })}

                </View>
                {/* ------------ Cards--------- */}
                <View>
                    {isLoaded ?
                        (
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', width: responsiveWidth(100) }}>
                                {arry.map((item) => {
                                    return (
                                        <View style={{
                                            backgroundColor: '#fff',
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
                                        }} >
                                            <ShimmerView style={{
                                                width: responsiveWidth(46),
                                                height: responsiveHeight(15),
                                                borderRadius: 10,
                                            }}>
                                                <ShimmerView style={{ backgroundColor: '#9e9e9e', width: responsiveWidth(46), height: responsiveHeight(15), borderTopLeftRadius: 10, borderTopRightRadius: 10, opacity: .4 }}></ShimmerView>
                                            </ShimmerView>
                                            <View style={{ padding: 10, height: responsiveHeight(15), flexDirection: 'column', justifyContent: 'space-between' }}>
                                                <ShimmerView style={{ width: responsiveWidth(40), height: responsiveHeight(3), backgroundColor: '#9e9e9e', opacity: .4, borderRadius: 8 }}></ShimmerView>
                                                <ShimmerView style={{ width: responsiveWidth(30), height: responsiveHeight(3), backgroundColor: '#9e9e9e', opacity: .4, borderRadius: 8 }}></ShimmerView>
                                                <ShimmerView style={{ width: responsiveWidth(15), height: responsiveHeight(3), backgroundColor: '#9e9e9e', opacity: .4, borderRadius: 8 }}></ShimmerView>

                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        )
                        :
                        (

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', width: responsiveWidth(100) }}>
                                {productData?.map((item, index) => {
                                    return (
                                        <View>
                                            {item.price ? (
                                                <TouchableOpacity activeOpacity={.8} onPress={() => navigation.navigate('productDetails', {
                                                    image: item.image,
                                                    product_name: item.product_name,
                                                    details: item.description,
                                                    price: item.price,
                                                    weight: item.weight,
                                                    brand: item.brand_name,
                                                    unit: item.unit,
                                                    product_id: item.product_id

                                                })}>
                                                    <Animatable.View animation={'fadeInUpBig'} style={style.card} key={item.product_id}>
                                                        <View style={style.cardView}>

                                                            <Image style={{ resizeMode: 'contain', width: responsiveWidth(46), height: responsiveHeight(15), borderTopLeftRadius: 10, borderTopRightRadius: 10 }} source={{ uri: item.image }} />
                                                        </View>
                                                        <View style={{ padding: 10, height: responsiveHeight(15), borderBottomLeftRadius: 10, borderBottomRightRadius: 10, flexDirection: 'column', justifyContent: 'space-between' }}>

                                                            <Text style={{ color: 'black', fontSize: responsiveFontSize(2), textAlign: 'center', fontWeight: '600' }}>{item.product_name} </Text>
                                                            <Text style={{ color: 'black', fontSize: responsiveFontSize(2), textAlign: 'center' }}>{item.description} </Text>

                                                            <Text style={{ color: 'orange', fontSize: responsiveFontSize(2.5), textAlign: 'center' }}>{item.price}</Text>
                                                        </View>
                                                    </Animatable.View>
                                                </TouchableOpacity>
                                            ) : (<Text style={{ fontSize: responsiveFontSize(2), padding: 10, textAlign: 'center' }}>Data not found</Text>)}

                                        </View>
                                    )
                                })}

                            </View>

                        )}
                </View>


            </ScrollView>
        </SafeAreaView>
    )
}
const style = StyleSheet.create({
    // -----------New Arrival Cards-------------
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
})