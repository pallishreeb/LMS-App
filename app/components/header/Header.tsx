import {Text, TouchableOpacity, View} from 'react-native';
import React, {useContext} from 'react';

import {styles} from './styles';
import {useNavigation} from '@react-navigation/native';
import {hp} from '../../helpers/resDimension';
import {useIcon} from '../../assets/icons/useIcon';
import {typography} from '../../assets/fonts/typography';

const Header = props => {
  const navigation = useNavigation();
  const {
    backgroundColor = styles.headerBackgroundColor.backgroundColor,
    onPress = () => navigation.goBack(),
    leftIcon = true,
    rightIcon = true,
    leftIconName = 'arrowleft',
    title = `Getting Started`,
    // marginLeft = Platform.OS === 'ios' ? hp(11) : hp(11),
    marginLeft = hp(11),
    font,
  } = props;
  return (
    <View style={[{backgroundColor: backgroundColor}, styles.wrapper]}>
      <View style={styles.innerWrapper}>
        {
          leftIcon ? (
            <TouchableOpacity onPress={() => onPress()}>
              {leftIconName == 'leftArrow'
                ? useIcon.ArrowLeft()
                : useIcon.Menu()}
            </TouchableOpacity>
          ) : null
          // <View style={styles.placeHolderView} />
        }
        <Text
          style={[
            [styles.heading],
            {
              fontFamily:
                font === 'regular'
                  ? typography.Inter_SemiBold
                  : typography.Inasnibc,
            },
          ]}>
          {title}
        </Text>
        {rightIcon ? (
          <TouchableOpacity onPress={() => onPress()}>
            {useIcon.UserIcon()}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default Header;
