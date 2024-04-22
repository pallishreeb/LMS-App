import {createStackNavigator} from '@react-navigation/stack';
import Login from '../../screens/beforeLogin/login/Login';
import SignUp from '../../screens/beforeLogin/signUp/SignUp';
import Otp from '../../screens/beforeLogin/otp/Otp';
import ForgotPass from '../../screens/beforeLogin/forgotPass/forgotPass';
import BottomTab from '../../helpers/BottomTab';
import BookDetails from '../../screens/afterLogin/BookDetails/BookDetails';
import Payment from '../../screens/afterLogin/Payment/Payment';
import PdfViewer from '../../screens/afterLogin/PdfViewer/PdfViewer';
import BookVideos from '../../screens/afterLogin/BookVideos/BookVideos';
import VideoPlayerEx from '../VideoPlayer/VideoPlayer';

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
        name="BottomTab"
        component={BottomTab}
        options={{headerShown: false}}
      />
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
        name="BookDetails"
        component={BookDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PdfViewer"
        component={PdfViewer}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BookVideos"
        component={BookVideos}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="VideoPlayerEx"
        component={VideoPlayerEx}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="VideoScreen"
        component={VideoScreen}
        options={{headerShown: false}}
      /> */}
    </Stack.Navigator>
  );
};

export default BeforeLoginStack;
