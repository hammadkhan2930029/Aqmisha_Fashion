import React, { useState, useEffect } from "react";
import { Text, View, SafeAreaView, Image, StyleSheet, TouchableOpacity, StatusBar, BackHandler } from 'react-native'
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import Icon from 'react-native-vector-icons/FontAwesome';
import AnotherIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from 'react-native-animatable';
import AnimatedLoader from 'react-native-animated-loader';
import NavbarTop from "../drawer/navbar";


const Profile_details = (props) => {
    const navigation = useNavigation();
    const [visible, setvisible] = useState(true);

    // --------------------------------
    const [modalVisible, setModalVisible] = useState(false);
    const [user_id, setuser_id] = useState();
    const [user, setuser] = useState([]);


    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                navigation.navigate('profile');
                return true;
            }
        );

        return () => backHandler.remove();
    }, [navigation]);
    //    ----------------------------




    const getMyObject = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('user_details')
            if (jsonValue != null) {
                const userDetails = JSON.parse(jsonValue);
                setuser(userDetails)

            }
        } catch (e) {
            console.log('get object error' + e);
        }
    };

    useEffect(() => {
        getMyObject();

    }, []);





    useEffect(() => {

        if (user) {
            setvisible(false)
            console.log('profile');


        }

    }, [])





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
            <Animatable.View animation={'slideInDown'} style={{
                width: responsiveWidth(100), height: responsiveHeight(8), backgroundColor: '#fff', shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                padding: 5,
                elevation: 5,
            }}>
                <TouchableOpacity activeOpacity={.5} onPress={() => navigation.navigate('profile')}>
                    <View style={styles.icon}>
                        <AnotherIcon name='keyboard-arrow-left' size={30} color='#000' style={styles.arrowback}/>
                    </View>
                </TouchableOpacity>




            </Animatable.View>


            {/* ----------------------------------------------------------------------------------- */}





            {user?.map((item, index) => {
                console.log(item)
                return (

                    <View key={index}>
                        <View >


                            <Animatable.View animation={'flipInX'} style={{
                                marginTop: -20, alignSelf: 'center', width: responsiveWidth(40), height: responsiveHeight(20), borderRadius: 100, backgroundColor: 'white', shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                            }}>
                                <Image style={{ alignSelf: 'center', width: responsiveWidth(40), height: responsiveHeight(20), borderRadius: 100 }} source={{ uri: item.user_image }} />
                            </Animatable.View>
                            <Text style={styles.text}> {item.first_name}</Text>


                        </View>
                        <View style={{
                            width: responsiveWidth(95), alignSelf: 'center',  borderRadius: 10, backgroundColor: '#fff', shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                        }}>
                            <View>
                                <Text style={{ fontSize: responsiveFontSize(3), color: '#000', padding: 10, fontWeight: '700' }}>Information</Text>
                            </View>


                            <View style={styles.card}>
                                <Text style={styles.text1}>User Name</Text>
                                <Text style={styles.text2}>{item.first_name + " " + item.last_name}</Text>

                            </View>
                            <View style={styles.card}>
                                <Text style={styles.text1}>User Email</Text>
                                <Text style={styles.text2}>{item.email}</Text>

                            </View>
                            <View style={styles.card}>
                                <Text style={styles.text1}>Phone Number</Text>
                                <Text style={styles.text2}>{item.mobile_no}</Text>

                            </View>
                            <View style={styles.card}>
                                <Text style={styles.text1}>Address</Text>
                                <Text style={styles.text2}>{item.address}</Text>

                            </View>
                            <View style={styles.card}>
                                <Text style={styles.text1}>Country</Text>
                                <Text style={styles.text2}>{item.country}</Text>

                            </View>
                            <View style={styles.card}>
                                <Text style={styles.text1}>City</Text>
                                <Text style={styles.text2}>{item.city}</Text>

                            </View>



                        </View>



                    </View>
                )
            })
            }


        </SafeAreaView>

    )
};
const styles = StyleSheet.create({
    icon: {
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        margin: 3,
        elevation: 5,
        borderRadius: 25,
        padding: 2,
        width: responsiveWidth(10),
        height: responsiveHeight(5)
    },
    text: {
        color: '#353839',
        fontSize: responsiveFontSize(3),
        padding: 5,
        textAlign: 'center',
        fontWeight: 'bold'


    },
    text1: { fontSize: responsiveFontSize(2), color: '#000', padding: 10, textAlign: 'center' },
    text2: { fontSize: responsiveFontSize(2), color: '#808080', padding: 10, textAlign: 'center' },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 5
    },

    lottie: {
        width: 100,
        height: 100
    }
})
export default Profile_details;