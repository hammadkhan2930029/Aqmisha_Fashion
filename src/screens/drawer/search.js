import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, ScrollView, SafeAreaView, TouchableOpacity, BackHandler } from "react-native";
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import NavbarTop from "./navbar";
import Icon from 'react-native-vector-icons/MaterialIcons'

const Search = () => {

    const navigation = useNavigation();
    const [data, setData] = useState([]);
   
    const searchUser = async (text) => {
        console.log(text);
        try {
            const url = `https://aqmishafashion.online/api/view_data_api.php?view=product-search&key_word=${text}`;
            let response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let result = await response.json();

            if (result && result.msg) {
                setData(result.msg);
            } else {
                console.log('No data found');
                setData([]);
            }

        } catch (error) {
            console.log('Api error', error);
            setData([]);
        }
    };

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
            <View style={{
                width: responsiveWidth(90),
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
                margin: 10,
                backgroundColor: '#f5f5f5',
                borderRadius: 25,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 6,
                },
                shadowOpacity: 0.37,
                shadowRadius: 7.49,
                elevation: 12,
            }}>

                <View style={{ padding: 5, width: responsiveWidth(10) }}>
                    <Icon name='search' size={30} color='black' />

                </View>

                <TextInput
                    style={{ width: responsiveWidth(75), padding: 10, fontSize: responsiveFontSize(2.5), color: 'black' }}
                    placeholder="Search "
                    placeholderTextColor="gray"

                    onChangeText={(text) => searchUser(text)}
                />
            </View>
            <ScrollView>



                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', width: responsiveWidth(100) }}>

                    {
                        data.length ?
                            data?.map((item, index) => {
                                // console.log('search', item)
                                return (
                                    <View key={index}>
                                        {item.response !== 'no data' ? (
                                            <TouchableOpacity activeOpacity={.8} onPress={() => navigation.navigate('productDetails', {
                                                image: item.image,
                                                product_name: item.product_name,
                                                id: item.product_id,
                                                details: item.description,
                                                price: item.price,
                                                weight: item.weight,
                                                brand: item.brand_name,
                                                unit: item.unit

                                            })}>
                                                <View style={style.card} key={item.product_id}>
                                                    <View style={style.cardView}>

                                                        <Image style={{ resizeMode: 'contain', width: responsiveWidth(46), height: responsiveHeight(15), borderTopLeftRadius: 10, borderTopRightRadius: 10 }} source={{ uri: item.image }} />
                                                    </View>
                                                    <View style={{ padding: 10, height: responsiveHeight(15), borderBottomLeftRadius: 10, borderBottomRightRadius: 10, flexDirection: 'column', justifyContent: 'space-between' }}>

                                                        <Text style={{ color: 'black', fontSize: responsiveFontSize(2), textAlign: 'center', fontWeight: '600' }}>{item.product_name} </Text>
                                                        <Text style={{ color: 'black', fontSize: responsiveFontSize(2), textAlign: 'center' }}>{item.description.substring(0, 15) + '...'} </Text>

                                                        <Text style={{ color: 'orange', fontSize: responsiveFontSize(2.5), textAlign: 'center' }}>Rs.{item.price}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        ) : (<Text style={{textAlign:'center',padding:10}}>data not found</Text>)}
                                    </View>

                                )
                            }) : null
                    }
                </View>


            </ScrollView>
        </SafeAreaView>
    )

};
const style = StyleSheet.create({
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
});
export default Search;