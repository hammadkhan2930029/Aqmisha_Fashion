import React from "react";
import 'react-native-gesture-handler';
import { Provider } from "react-redux";
import { myStore } from "./src/screens/Redux/storage";

import { ToastProvider } from 'react-native-toast-notifications'
import StackNavigator from "./src/screens/stacknavigator";



const App = () => {

  return (

    <Provider store={myStore}>
      <ToastProvider>

        <StackNavigator />
      </ToastProvider>

    </Provider>

  )
};

export default App;