import React from "react";
import { View } from "react-native";

import MyDrawer from "../drawer/drawerNavigation";


const Main_main = ({ navigation }) => {


    return (
        <View style={{ flex: 1 }}>
            <MyDrawer />
        </View>
    )
};

export default Main_main;