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



const Profile = (props) => {
    const navigation = useNavigation();
    const [visible, setvisible] = useState(false);
    const [isclicked, setisClicked] = useState(false)
    // --------------------------------
    const [modalVisible, setModalVisible] = useState(false);
    const [user_id, setuser_id] = useState();
    const [user, setuser] = useState();


    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                navigation.navigate('main');
                return true;
            }
        );

        return () => backHandler.remove();
    }, [navigation]);
    //    ----------------------------------------------




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

    console.log("user", user)




    useEffect(() => {

        if (user) {
            setvisible(false)
            console.log('profile');


        }

    }, [])



    let clearAll = async () => {
        setvisible(true)
        try {
            // Clear AsyncStorage
            await AsyncStorage.clear();
            console.log('AsyncStorage cleared.');
        } catch (error) {
            console.log('Error clearing AsyncStorage:', error);
        }

        // Navigate to Home screen

        navigation.replace('main');
        setvisible(false)
        console.log('Navigated to Home.');
    }

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
                elevation: 5,
                padding: 5,
            }}>
                <TouchableOpacity activeOpacity={.5} onPress={() => navigation.navigate('main')}>
                    <View style={styles.icon}>
                        <AnotherIcon name='keyboard-arrow-left' size={30} color='#000' />
                    </View>
                </TouchableOpacity>




            </Animatable.View>


            {/* ----------------------------------------------------------------------------------- */}



            <View>{user !== null ? (
                <View>

                    {user?.map((item, index) => {
                        // console.log(item)
                        return (

                            <View key={index}>
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
                        )
                    })
                    }
                </View>
            ) : null}</View>
            {/* ---------------------------------------------------------------------------------- */}
            <View style={styles.card}>
                <View>
                    <TouchableOpacity onPress={() => navigation.navigate('profile_details')}>

                        <View style={{ width: responsiveWidth(92), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', marginTop: 30 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <AnotherIcon name='account-circle' size={30} color='#000' />

                                <Text style={{ fontSize: responsiveFontSize(2.3), color: '#000', paddingLeft: 8 }}>Account Detail</Text>
                            </View>
                            <View>

                                <AnotherIcon name='keyboard-arrow-right' size={30} color='#000' />
                            </View>
                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => navigation.navigate("orderPlaceDetails")}>

                        <View style={{ width: responsiveWidth(92), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', marginTop: 25 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <AnotherIcon name='local-shipping' size={30} color='#000' />

                                <Text style={{ fontSize: responsiveFontSize(2.3), color: '#000', paddingLeft: 8 }}>Order History</Text>
                            </View>
                            <View>

                                <AnotherIcon name='keyboard-arrow-right' size={30} color='#000' />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setisClicked(!isclicked)}>

                        <View style={{ width: responsiveWidth(92), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', marginTop: 25 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <AnotherIcon name='settings' size={30} color='#000' />

                                <Text style={{ fontSize: responsiveFontSize(2.3), color: '#000', paddingLeft: 8 }}>Setting</Text>
                            </View>
                            <View>

                                <AnotherIcon name={isclicked ? "keyboard-arrow-down" : 'keyboard-arrow-right'} size={30} color='#000' />
                            </View>
                        </View>
                    </TouchableOpacity>
                    {isclicked ? (


                        <View style={styles.dropdown}>
                            <TouchableOpacity onPress={() => navigation.navigate('edite_profile')}>

                                <Text style={{ fontSize: responsiveFontSize(2.3), color: '#000', padding: 8 }}>Edite Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('change_password')}>

                                <Text style={{ fontSize: responsiveFontSize(2.3), color: '#000', padding: 8 }}>Change Password</Text>
                            </TouchableOpacity>

                        </View>
                    ) : null}
                </View>
                <View>

                    <TouchableOpacity activeOpacity={.8} onPress={() => clearAll()}>

                        <View style={{
                            width: responsiveWidth(92), backgroundColor: '#fff',
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                            borderRadius: 10,
                            padding: 5,
                            alignSelf: 'center',
                            borderColor: '#E0E0E0',
                            borderWidth: .8,
                            
                        }}>
                            <Text style={{ fontSize: responsiveFontSize(2.5), color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Log out</Text>

                        </View>
                    </TouchableOpacity>
                </View>
            </View>


        </SafeAreaView>

    )
};
const styles = StyleSheet.create({
    icon: {
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
        height: responsiveHeight(5),

    },
    text: {
        color: '#353839',
        fontSize: responsiveFontSize(3),
        padding: 5,
        textAlign: 'center',
        fontWeight: 'bold'


    },
    card: {
        width: responsiveWidth(100),
        height: responsiveHeight(60),
        // backgroundColor:'blue',
        flexDirection: 'column',
        justifyContent: 'space-between'

    },

    lottie: {
        width: 100,
        height: 100
    },
    dropdown: {
        width: responsiveWidth(92),
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
})
export default Profile;