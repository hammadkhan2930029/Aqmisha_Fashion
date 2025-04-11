import React from "react";
import { View } from "react-native";
import Bottom from "../bottom/bottom_navigation";


const Main_drawer = ({ navigation }) => {


    return (
        <View style={{ flex: 1 }}>
            <Bottom/>
        </View>
    )
};

export default Main_drawer;