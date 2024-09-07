import { createDrawerNavigator } from '@react-navigation/drawer';

import CustomDrawer from './customDrawer';

import NavbarTop from './navbar';
import { Sub_category } from './sub_category';
import { Sub_subCategory } from './sub_subCategorys';
import Main_drawer from './main_drawer';
import ProductDetails from './productDetail';
import Search from './search';
import Profile from '../bottom/profile';
import About from './about';
import Contact_us from './contact_us';
import Deals from './deals';
import Deals_detail from './deals_details';
import Shop from './Shop';


const Drawer = createDrawerNavigator();

const MyDrawer = () => {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawer {...props} />}
            initialRouteName="main_drawer">
            <Drawer.Screen name="main_drawer" component={Main_drawer} options={{ headerShown: false }} />
            <Drawer.Screen name="navbar" component={NavbarTop} options={{ headerShown: false }} />
            <Drawer.Screen name="customDrawer" component={CustomDrawer} options={{ headerShown: false }} />
            <Drawer.Screen name="sub_category" component={Sub_category} options={{ headerShown: false }} />
            <Drawer.Screen name="sub_sub_category" component={Sub_subCategory} options={{ headerShown: false }} />
            <Drawer.Screen name="productDetails" component={ProductDetails} options={{ headerShown: false }} />
            <Drawer.Screen name="Search" component={Search} options={{ headerShown: false }} />
            <Drawer.Screen name="aboute" component={About} options={{ headerShown: false }} />
            <Drawer.Screen name="contact" component={Contact_us} options={{ headerShown: false }} />
            <Drawer.Screen name="deals" component={Deals} options={{ headerShown: false }} />
            <Drawer.Screen name="deals_detail" component={Deals_detail} options={{ headerShown: false }} />
            <Drawer.Screen name="shop" component={Shop} options={{ headerShown: false }} />







        </Drawer.Navigator>

    );
}

export default MyDrawer;