import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Main_main from './normal/main';
import SplashScreen from './normal/splash';
import Register from './bottom/register';
import LogIn from './bottom/login';
import Profile from './bottom/profile';
import Checkout from './normal/checkOut';
import ForgetPassword from './bottom/forgetPassword';
import Orderplace_details from './normal/order_place_details';
import Home from './bottom/home';
import Profile_details from './bottom/profile_details'
import About from './drawer/about';
import Change_password from './bottom/change_password';
import { ProductProvider } from './bottom/product';
import Edite_Profile from './bottom/edite_profile';





const Stack = createNativeStackNavigator()

const StackNavigator = () => {

    return (
        <ProductProvider>
            <NavigationContainer>

                <Stack.Navigator>
                    <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="main" component={Main_main} options={{ headerShown: false }} />
                    <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                    <Stack.Screen name="register" component={Register} options={{ headerShown: false }} />
                    <Stack.Screen name="login" component={LogIn} options={{ headerShown: false }} />
                    <Stack.Screen name="edite_profile" component={Edite_Profile} options={{ headerShown: false }} />
                    <Stack.Screen name="profile" component={Profile} options={{ headerShown: false }} />
                    <Stack.Screen name="checkout" component={Checkout} options={{ headerShown: false }} />
                    <Stack.Screen name="forget" component={ForgetPassword} options={{ headerShown: false }} />
                    <Stack.Screen name="orderPlaceDetails" component={Orderplace_details} options={{ headerShown: false }} />
                    <Stack.Screen name="profile_details" component={Profile_details} options={{ headerShown: false }} />
                    <Stack.Screen name="change_password" component={Change_password} options={{ headerShown: false }} />

                </Stack.Navigator>
            </NavigationContainer>
        </ProductProvider>

    )
};

export default StackNavigator;