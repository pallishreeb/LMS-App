import * as React from 'react';
import {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AfterLoginStack from './app/components/navigators/AfterLoginStack';
import BeforeLoginStack from './app/components/navigators/BeforeLoginStack';
import SplashScreen from 'react-native-splash-screen';
import {Provider, useSelector} from 'react-redux';
import {store} from './app/redux/Store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyOrders from './app/screens/afterLogin/MyOrders/MyOrders';
import {MyDrawer} from './app/helpers/DrawerNavigation/DrawerNavigation';
import Orientation from 'react-native-orientation-locker';
import RootNavigation from './RootNavigation';
export default function App() {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  }, []);
  useEffect(() => {
    Orientation.lockToPortrait; // Lock the app to landscape orientation
    return () => {
      Orientation.unlockAllOrientations(); // Ensure orientation is unlocked when component unmounts
    };
  }, []);
  const [isLogged, setIsLogged] = React.useState('');
  const [token, setToken] = React.useState('');
  const [isloading, setIsLoading] = React.useState(false);
  async function getLoggedIn() {
    setIsLoading(true);
    const token = await AsyncStorage.getItem('token');
    console.log('🚀 ~ getLoggedIn ~ token:', token);
    setToken(token);
    if (token == '') {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    getLoggedIn();
  }, []);

  return (
    <Provider store={store}>
      <RootNavigation />
    </Provider>
  );
}
