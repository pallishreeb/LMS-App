import * as React from 'react';
import {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AfterLoginStack from './app/components/navigators/AfterLoginStack';
import BeforeLoginStack from './app/components/navigators/BeforeLoginStack';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import {store} from './app/redux/Store';
export default function App() {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <BeforeLoginStack />
      </NavigationContainer>
    </Provider>
  );
}
