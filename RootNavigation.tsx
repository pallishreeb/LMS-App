// RootNavigator.js
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import AfterLoginStack from './app/components/navigators/AfterLoginStack';
import BeforeLoginStack from './app/components/navigators/BeforeLoginStack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RootNavigation = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState('');

  useEffect(() => {
    const checkToken = async () => {
      const TOKEN = await AsyncStorage.getItem('token');
      setToken(TOKEN);
      setIsLoading(false);
    };

    checkToken();
  }, []);

  if (isLoading) {
    // Return a loading screen or null while checking token
    return null;
  }

  return (
    <NavigationContainer>
      {isLoggedIn || token ? <AfterLoginStack /> : <BeforeLoginStack />}
    </NavigationContainer>
  );
};

export default RootNavigation;
