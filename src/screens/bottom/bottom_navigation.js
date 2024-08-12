import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { responsiveHeight } from "react-native-responsive-dimensions";
import Profile from "./profile";
import View_Cart_details from "./view_Cart_details";
import Home from "./home";
import LogIn from "./login";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const Bottom = () => {
    const [user_id, setuser_id] = useState('');
    const [user, setuser] = useState('');

    const [viewCartData, setViewCartData] = useState('');


    //    -----------------redux-------------------------
    const randomNumber = useSelector(state => state.randomNumber.randomNumber);

    // ------------------AsyncStorage get data -------------------------



    const getMyObject = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('user_details')
            if (jsonValue != null) {
                const userDetails = JSON.parse(jsonValue);
                let firstUserId = userDetails.length > 0 ? userDetails[0].user_id : null;

                setuser_id(firstUserId);
                setuser(firstUserId)
            } else {
                setuser_id('')
                setuser(randomNumber)
            }

        } catch (e) {
            console.log('get object error' + e);
        }
    };


    // ------fetch add to cart list-------


    const getAddtocart = async () => {

        try {
            const url = `https://aqmishafashion.online/api/cart_api.php?cart=cart-products&user_id=${user}`;
            const response = await fetch(url)
            const result = await response.json()
                .then((result) => {

                    console.log('result', result)


                    setViewCartData(result.cart_count)


                }).catch((error) => {
                    console.log(error)
                })

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getMyObject()

        getAddtocart()


    }, [user_id])
    console.log('user id ', user_id)
    console.log('lenght', viewCartData)
    
    useFocusEffect(
        React.useCallback(() => {
            //   getAddtocart()
            setViewCartData('')
        }, [])
    );
   
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, size, color }) => {
                let iconName;
                if (route.name === 'Home') {
                    iconName = focused ? "home" : "home-outline";
                }
                else if (route.name === 'login') {
                    iconName = focused ? "person-circle" : "person-circle-outline";
                } else if (route.name === 'view_cart_details') {
                    iconName = focused ? "cart" : "cart-outline";
                }
                return <Ionicons name={iconName} size={size} color={color} />
            },
            tabBarInactiveTintColor: 'black',
            tabBarActiveTintColor: 'black',
            tabBarShowLabel: false,
            tabBarStyle: {
                position: 'absolute',
                right: 5,
                left: 5,
                bottom: 5,
                borderRadius: 15,
                height: responsiveHeight(8),
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 6,
                },
                shadowOpacity: 0.37,
                shadowRadius: 7.49,

                elevation: 12,

            }

        })}
        >
            <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Tab.Screen name="view_cart_details" component={View_Cart_details} options={{ headerShown: false, tabBarBadge: viewCartData > 0 ? viewCartData : null }} />
            <Tab.Screen name="login" component={user_id ? Profile : LogIn} options={{ headerShown: false }} />





        </Tab.Navigator >
    )
};



export default Bottom;

