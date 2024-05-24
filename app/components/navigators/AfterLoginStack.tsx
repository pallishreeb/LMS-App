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
import {MyDrawer} from '../../helpers/DrawerNavigation/DrawerNavigation';
import Courses from '../../screens/afterLogin/Courses/Courses';
import CourseDetails from '../../screens/afterLogin/CourseDetails/CourseDetails';
import MyOrders from '../../screens/afterLogin/MyOrders/MyOrders';
import PaymentInfo from '../../screens/afterLogin/PaymentInfo/PaymentInfo';
import ChapterVideo from '../../screens/afterLogin/ChapterVideos/ChapterVideo';

const Stack = createStackNavigator();
const AfterLoginStack = route => {
  return (
    <Stack.Navigator
      initialRouteName={'MyDrawer'}
      screenOptions={{
        headerStyle: {elevation: 0},
        cardStyle: {backgroundColor: '#fff'},
      }}>
      <Stack.Screen
        name="MyDrawer"
        component={MyDrawer}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AfterLoginStack;
