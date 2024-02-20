import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {fp, hp, wp} from '../../helpers/resDimension';
import {color} from '../../constants/colors/colors';
import CustomText from '../text/CustomText';
import {typography} from '../../assets/fonts/typography';

const ButtonComp = ({title, onPress}) => {
  return (
    <Pressable
      style={{
        backgroundColor: color.PRIMARY_BLUE,
        // height: hp(5),
        // width: wp(30),
        padding: fp(1.6),
        borderRadius: fp(0.5),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp(2),
      }}
      onPress={onPress}>
      <CustomText
        type={'typeRegular'}
        style={{
          fontFamily: typography.Inter_Medium,
          fontSize: fp(1.8),
          color: color.WHITE,
        }}>
        {title}
      </CustomText>
    </Pressable>
  );
};

export default ButtonComp;

const styles = StyleSheet.create({});
