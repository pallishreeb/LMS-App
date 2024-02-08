import {createStackNavigator} from '@react-navigation/stack';
import Login from '../../screens/beforeLogin/login/Login';

const Stack = createStackNavigator();
const AfterLoginStack = route => {
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
    </Stack.Navigator>
  );
};

export default AfterLoginStack;
