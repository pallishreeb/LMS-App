import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {fp, wp} from '../../helpers/resDimension';
import {color} from '../../constants/colors/colors';
export const useIcon = {
  EyeOff: () => (
    <FeatherIcon
      name="eye-off"
      size={fp(2.5)}
      color={color.WHITE}
      style={{marginRight: wp(2)}}
    />
  ),
  Eye: () => (
    <FeatherIcon
      name="eye"
      size={fp(2.5)}
      color={color.WHITE}
      style={{marginRight: wp(2)}}
    />
  ),
  LockOutline: () => (
    <MaterialIcons
      name="lock-outline"
      size={fp(2.5)}
      color={color.WHITE}
      style={{marginRight: wp(2)}}
    />
  ),
  UserOutline: () => (
    <FontAwesome5
      name="user"
      size={fp(2)}
      color={color.WHITE}
      style={{marginRight: wp(2)}}
    />
  ),
  ArrowRight: () => (
    <FontAwesome6
      name="arrow-right-long"
      size={fp(3)}
      color={color.PRIMARY_BLUE}
    />
  ),
  Phone: () => (
    <FeatherIcon
      name="phone"
      size={fp(2.5)}
      color={color.WHITE}
      style={{marginRight: wp(2)}}
    />
  ),
  Email: () => (
    <Fontisto
      name="email"
      size={fp(2.5)}
      color={color.WHITE}
      style={{marginRight: wp(2)}}
    />
  ),
  BlankCheckbox: () => (
    <MaterialCommunityIcons
      name="checkbox-blank-outline"
      size={fp(2.5)}
      color={color.WHITE}
      style={{marginRight: wp(2)}}
    />
  ),
  FilledCheckbox: () => (
    <MaterialCommunityIcons
      name="checkbox-marked"
      size={fp(2.5)}
      color={color.WHITE}
      style={{marginRight: wp(2)}}
    />
  ),
};
