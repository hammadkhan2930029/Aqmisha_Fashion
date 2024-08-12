

import React, { useState, useEffect } from "react";
import { Text, View, SafeAreaView, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import AnotherIcon from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Animatable from 'react-native-animatable';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik } from "formik";
import { object, string } from 'yup';
import { useToast } from "react-native-toast-notifications";
import AnimatedLoader from 'react-native-animated-loader';

let user_update_form = object({
    // first_name: string()
    //     .required("First Name is Required.")
    //     .min(1, "First Name is Too Short."),
    // last_name: string()
    //     .required("Last Name is Required.")
    //     .min(1, "Last Name is Too Short."),
    email: string()
        .email()
        .required("Email is Required."),
    mobile_no: string()
        .matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
            'Phone number is not valid'),
    address: string()
        .required('Address must Requird'),
});

const Edit_Profile = (props) => {
    const navigation = useNavigation();
    const toast = useToast();
    const [visible, setVisible] = useState(false);

    const [userImage, setUserImage] = useState(null);
    const [pick_image, setPick_image] = useState(null)
    const [user, setUser] = useState(null);
    const [user_Id, setUser_Id] = useState('');
    const [data1, setData1] = useState([]);



    //    -------------------------------------------------------------------------

    const imagepicker = async () => {
        let options = {
            mediaType: 'photo',
        };
        const response = await launchImageLibrary(options);
        if (!response.didCancel && !response.error) {
            setPick_image({
                uri: response.assets[0].uri,
                name: response.assets[0].fileName,
                filename: response.assets[0].fileName,
                type: response.assets[0].type
            });
        } else {
            console.log('Image Picker Error: ', response.error);
        }
    };
    console.log(pick_image)

    // -------------------------------------------------------------------------------------------
    const [country, setCountry] = useState("Select Country");
    const [isClicked, setIsClicked] = useState(false);
    const [data, setData] = useState([]);
    const getCountry = async () => {
        try {
            const response = await fetch('https://aqmishafashion.online/api/view_data_api.php?view=country');
            const result = await response.json();
            if (result && result.msg) {
                setData(result.msg);
            }
        } catch (error) {
            console.error('Error fetching country data:', error);
        }
    };

    useEffect(() => {
        getCountry();
    }, []);
    // ------------------------------------------------------------------------------------------------
    const [clicked, setClicked] = useState(false);
    const [city, setCity] = useState("Select City");
    const [cityData, setCityData] = useState([]);
    const getCity = async (country_id) => {
        try {
            const response = await fetch(`https://aqmishafashion.online/api/view_data_api.php?view=city&country_id=${country_id}`);
            const result = await response.json();
            if (result && result.msg) {
                setCityData(result.msg);
            }
        } catch (error) {
            console.error('Error fetching city data:', error);
        }
    };
    // ----------------------------------------------------------------------------------------
    const [aysnc_data, setaysnc_data] = useState({
        firstName: '',
        lastName: '',
        email:'',
        mobile:'',
        address:''
    })
    const getUserDetails = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('user_details');
            if (jsonValue) {
                const details = JSON.parse(jsonValue);
                if (details.length > 0) {
                    setData1(details);
                    const e = details.map((item) => {
                        setaysnc_data({
                            firstName: item.first_name,
                            lastName: item.last_name,
                            email:item.email,
                            mobile:item.mobile_no,
                            address:item.address
                        })
                        setUserImage(item.user_image);
                        setUser_Id(item.user_id);


                    })
                } else {
                    console.warn('No user details found');
                }
            } else {
                console.warn('No user details found in AsyncStorage');
            }
        } catch (e) {
            console.error('Error fetching user details:', e);
        }
    };
    // -------------------------------------------------------------------------------------
    const updateUserDetails = async (value) => {
        try {
            await AsyncStorage.removeItem('user_details');

            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('user_details', jsonValue)

        } catch (e) {
            console.error('Error updating user details:', e);
        }
    };
    useEffect(() => {
        getUserDetails();
    }, []);
    console.log(userImage, user_Id, aysnc_data)
    // -------------------------------------------------------------------------
    const update = async (value) => {
        setVisible(true);

        var formdata = new FormData();
        formdata.append('user_id', user_Id);
        formdata.append('first_name', aysnc_data.firstName);
        formdata.append('last_name', aysnc_data.lastName);
        formdata.append('email', value.email);
        formdata.append('mobile_no', value.mobile_no);
        formdata.append('address', value.address);
        formdata.append('country', country);
        formdata.append('city', city);
        formdata.append('user_image', pick_image);

        try {
            const url = `https://aqmishafashion.online/api/user_api.php?user=update-profile`;
            await fetch(url, {
                method: "POST",
                headers: {
                    'content-Type': 'multipart/form-data',
                },
                body: formdata
            }).then(response => response.json())
                .then((result) => {
                    console.log('result', result.user);
                    toast.show("update profile successful", {
                        type: "success",
                        placement: "top",
                        duration: 4000,
                        offset: 30,
                        animationType: "slide-in",
                    });
                    if (result.user) {

                        updateUserDetails(result.user);
                        navigation.navigate('profile')
                        setVisible(false);
                    }

                })
                .catch((error) => {
                    console.log(error);
                    toast.show("error", {
                        type: "warning",
                        placement: "top",
                        duration: 4000,
                        offset: 30,
                        animationType: "slide-in",
                    });
                    setVisible(false);
                });

        } catch (error) {
            console.log('try_Catch_error', error);
        }
    };

    return (
        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
            <AnimatedLoader
                visible={visible}
                overlayColor="rgba(255,255,255,1)"
                animationStyle={{ width: 100, height: 100 }}
                speed={1}>
                <Text>Loading...</Text>
            </AnimatedLoader>
            <ScrollView>
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
                    <TouchableOpacity activeOpacity={.5} onPress={() => navigation.goBack()}>
                        <View style={styles.icon}>
                            <AnotherIcon name='keyboard-arrow-left' size={30} color='#000' />
                        </View>
                    </TouchableOpacity>
                </Animatable.View>
                <Animatable.View animation={'slideInDown'}>
                    <View style={{
                        alignSelf: 'center',
                        width: responsiveWidth(40),
                        height: responsiveHeight(20),
                        borderRadius: 100,
                        backgroundColor: '#fff',
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                        marginTop: -20
                    }}>
                        <TouchableOpacity activeOpacity={.5} onPress={() => imagepicker()}>

                            {pick_image ? (

                                <Image style={{ alignSelf: 'center', width: responsiveWidth(40), height: responsiveHeight(20), borderRadius: 100, resizeMode: 'contain' }} source={{ uri: pick_image.uri }} />
                            ) : (
                                <Image style={{ alignSelf: 'center', width: responsiveWidth(40), height: responsiveHeight(20), borderRadius: 100, resizeMode: 'contain' }} source={{ uri: userImage }} />

                            )}
                        </TouchableOpacity>
                        <View style={{ backgroundColor: '#f5f5f5', width: responsiveWidth(10), height: responsiveHeight(5), alignSelf: 'flex-end', marginTop: -50,  borderRadius: 50 }}>

                            <Icon name="edit" color={'#000'} size={25} style={{ alignSelf: 'center' }} />
                        </View>
                    </View>
                </Animatable.View>
                <Animatable.View animation={'slideInUp'} style={{ padding: 10 }}>
                    <Formik
                        initialValues={{
                            // first_name: aysnc_data.firstName,
                            // last_name: aysnc_data.lastName,
                            email: '',
                            mobile_no: '',
                            address: '',
                        }}
                        validationSchema={user_update_form}
                        onSubmit={(values, { resetForm }) => {
                            update(values)
                            resetForm();
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, touched, errors, isValid }) => (
                            <View>
                                <View >
                                    <TextInput
                                        // onChangeText={handleChange('first_name')}
                                        // onBlur={handleBlur('first_name')}
                                        // value={values.first_name}
                                        placeholder={aysnc_data.firstName}
                                        style={styles.textinput}
                                        placeholderTextColor="#000"
                                        editable={false}
                                    />
                                    {/* {errors.first_name && touched.first_name ? (
                                        <Text style={styles.error}>{errors.first_name}</Text>
                                    ) : null} */}
                                </View>
                                <View >
                                    <TextInput
                                        // onChangeText={handleChange('last_name')}
                                        // onBlur={handleBlur('last_name')}
                                        // value={values.last_name}
                                        placeholder={aysnc_data.lastName}
                                        style={styles.textinput}
                                        placeholderTextColor="#000"
                                        editable={false}
                                    />
                                    {/* {errors.last_name && touched.last_name ? (
                                        <Text style={styles.error}>{errors.last_name}</Text>
                                    ) : null} */}
                                </View>
                                <View >
                                    <TextInput
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email}
                                        placeholder={aysnc_data.email}
                                        style={styles.textinput}
                                        placeholderTextColor="gray"
                                    />
                                    {errors.email && touched.email ? (
                                        <Text style={styles.error}>{errors.email}</Text>
                                    ) : null}
                                </View>
                                <View >
                                    <TextInput
                                        onChangeText={handleChange('mobile_no')}
                                        onBlur={handleBlur('mobile_no')}
                                        value={values.mobile_no}
                                        placeholder={aysnc_data.mobile}
                                        style={styles.textinput}
                                        placeholderTextColor="gray"
                                    />
                                    {errors.mobile_no && touched.mobile_no ? (
                                        <Text style={styles.error}>{errors.mobile_no}</Text>
                                    ) : null}
                                </View>
                                <View >
                                    <TextInput
                                        onChangeText={handleChange('address')}
                                        onBlur={handleBlur('address')}
                                        value={values.address}
                                        placeholder={aysnc_data.address}
                                        style={styles.textinput}
                                        placeholderTextColor="gray"
                                        numberOfLines={2}
                                        multiline={true}
                                    />
                                    {errors.address && touched.address ? (
                                        <Text style={styles.error}>{errors.address}</Text>
                                    ) : null}
                                </View>
                                {/* ------------------------------------Country-------------------------------------- */}
                                <TouchableOpacity style={styles.dropDownSelector} onPress={() => { setIsClicked(!isClicked) }}>
                                    <Text style={{ fontSize: responsiveFontSize(2), color: 'gray' }}>{country == '' ? 'Select Country' : country}</Text>
                                    {isClicked ? <Icon name='arrow-drop-down' color='gray' size={30} /> : <Icon color='gray' name='arrow-right' size={30} />}

                                </TouchableOpacity>
                                {isClicked ? (<View style={styles.dropDownAera}>
                                    {

                                        data?.map((item) => {
                                            return (
                                                <ScrollView>
                                                    <View>
                                                        <TouchableOpacity
                                                            style={styles.countriesItem}
                                                            onPress={() => {
                                                                setCountry(item.country_name);
                                                                setIsClicked(false)
                                                                getCity(item.country_id)

                                                            }}>

                                                            <Text style={{ color: 'black', fontSize: responsiveFontSize(2) }}>{item.country_name}</Text>


                                                        </TouchableOpacity>

                                                    </View>
                                                </ScrollView>
                                            )
                                        })

                                    }

                                </View>) : null}

                                {/* ---------------City dropDown--------------- */}
                                <TouchableOpacity style={styles.dropDownSelector} onPress={() => { setClicked(!clicked) }}>
                                    <Text style={{ fontSize: responsiveFontSize(2), color: 'gray' }}>{city == '' ? 'Select City' : city}</Text>
                                    {clicked ? <Icon name='arrow-drop-down' color='gray' size={30} /> : <Icon color='gray' name='arrow-right' size={30} />}

                                </TouchableOpacity>


                                {clicked ? (<View style={styles.dropDownAera}>

                                    {

                                        cityData?.map((item) => {
                                            return (
                                                <ScrollView>
                                                    <View>
                                                        <TouchableOpacity
                                                            style={styles.countriesItem}
                                                            onPress={() => {
                                                                setCity(item.city_name);
                                                                setClicked(false)
                                                            }}>

                                                            <Text style={{ color: 'black', fontSize: responsiveFontSize(2.2), paddingTop: 10 }}>{item.city_name}</Text>

                                                        </TouchableOpacity>

                                                    </View>
                                                </ScrollView>
                                            )


                                        })

                                    }
                                </View>) : null}



                                {/* --------------------------------------------------------------------------------- */}
                                <TouchableOpacity  onPress={handleSubmit} style={{
                                    width: responsiveWidth(90),
                                    backgroundColor: isValid ? 'black' : 'gray',
                                    padding: 15,
                                    marginTop: 20,
                                    borderRadius: 10,
                                    alignSelf: 'center'

                                }}>
                                    <Text style={{ color: '#fff', fontSize: responsiveFontSize(2.5), fontWeight: '700', textAlign: 'center' }}>UPDATE</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>
                </Animatable.View>
            </ScrollView>
        </SafeAreaView>
    );
}

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
        height: responsiveHeight(5)
    },

    textinput: {

        width: responsiveWidth(90),
        padding: 15,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        color: 'black',
        marginTop: 15
    },
    error: {
        fontSize: responsiveFontSize(2),
        color: 'red'
    },
    dropDownSelector: {
        width: responsiveWidth(90),
        borderBottomWidth: .8,
        borderBottomColor: 'gray',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        padding: 15

    },
    dropDownAera: {
        width: responsiveWidth(90),
        borderRadius: 10,
        alignSelf: 'center',
        margin: 10,
        backgroundColor: 'white',
        padding: 10,
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

export default Edit_Profile;


