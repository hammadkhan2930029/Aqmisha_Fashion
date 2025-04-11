import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, View, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import {
    responsiveFontSize, responsiveHeight, responsiveWidth
} from 'react-native-responsive-dimensions'
import Icon from 'react-native-vector-icons/MaterialIcons'
import * as Animatable from 'react-native-animatable';
import NavbarTop from "./navbar";
import { baseUrl } from "../../Config/baseUrl";



export const Sub_category = (props) => {
    const navigation = useNavigation();
    const { category_id, category_name } = props.route.params


    // ----------Sub Category---------------------

    const [subCatData, setsubCatData] = useState([])
    const [isloaded, setIsloaded] = useState(true);

    const subCategory = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/view_data_api.php?view=sub-category&category_id=${category_id}`)
            const res = await response.json()
                .then((res) => {

                    setsubCatData(res.msg)
                    setIsloaded(false)
                }).catch(error => console.log(error))

        } catch (error) {
            console.log(error);
        }

    }
    useEffect(() => {
        subCategory()
    }, [category_id])


    return (
        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
            {/* ----------Top NavBar--------- */}
            <Animatable.View animation={'slideInDown'}>
                <NavbarTop />
            </Animatable.View>
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>

                <View>
                    <Icon onPress={() => navigation.goBack()} name='keyboard-arrow-left' size={30} color='black' />
                </View>
                <View style={{ alignSelf: 'center' }}>
                    <Text style={{ fontSize: responsiveFontSize(3), color: 'black', fontWeight: 'bold', padding: 15 }}>Sub Categorys</Text>
                </View>
            </View>
            <View>
                <Text style={{ fontSize: responsiveFontSize(2.5), padding: 10, color: 'black' }}>{category_name}</Text>
            </View>
            {isloaded ? (<ActivityIndicator size="large" color="#0000ff" />) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', width: responsiveWidth(100) }}>
                    {subCatData?.map((item, index) => {
                        console.log('sub-cat', item)

                        return (
                            <TouchableOpacity activeOpacity={.6} disabled={item.response == 'no data'} onPress={() => navigation.navigate('sub_sub_category', {
                                'category_name': category_name,
                                'sub_category_name': item.sub_category_name,
                                'sub_category_id': item.sub_category_id,
                                'category_id': category_id
                            })}>
                                <View style={{ margin: 10 }} key={index}>
                                    <View style={{
                                        backgroundColor: '#fff', width: responsiveWidth(16), height: responsiveHeight(8), borderRadius: 50, shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                        elevation: 5,
                                        alignSelf: 'center',
                                        // padding: 10
                                    }}>
                                        {item.sub_category_name == "Abaya" ? (
                                            <Image style={{width:responsiveWidth(16),height:responsiveHeight(8)}} source={require('../../NewAssets/abaya.png')}/>
                                        ) : (

                                            <Icon style={{ alignSelf: 'center' }} name='error-outline' color='black' size={40} />
                                        )}
                                    </View>

                                    <Text style={{ fontSize: responsiveFontSize(2), color: 'black', fontWeight: '600', textAlign: 'center' }}>{item.sub_category_name || 'data not found'}</Text>
                                </View>

                            </TouchableOpacity>
                        )
                    })
                    }
                </View>
            )}


        </SafeAreaView>
    )
}