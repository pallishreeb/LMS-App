import {createStackNavigator} from '@react-navigation/stack';
import Login from '../../screens/beforeLogin/login/Login';
import SignUp from '../../screens/beforeLogin/signUp/SignUp';
import Otp from '../../screens/beforeLogin/otp/Otp';
import ForgotPass from '../../screens/beforeLogin/forgotPass/forgotPass';
import Home from '../../screens/afterLogin/Home/Home';

const Stack = createStackNavigator();
const BeforeLoginStack = route => {
  return (
    <Stack.Navigator
      initialRouteName={'Login'}
      screenOptions={{
        headerStyle: {elevation: 0},
        cardStyle: {backgroundColor: '#fff'},
      }}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Otp" component={Otp} options={{headerShown: false}} />
      <Stack.Screen
        name="ForgotPass"
        component={ForgotPass}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default BeforeLoginStack;
