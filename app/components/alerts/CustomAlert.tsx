import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {color} from '../../constants/colors/colors';
import {fp, hp, wp} from '../../helpers/resDimension';
import {PaymentAlertIllustration} from '../../assets/images';
import CustomText from '../text/CustomText';
import ButtonComp from '../button/Button';
import {useIcon} from '../../assets/icons/useIcon';

const CustomAlert = ({
  btnTitle,
  title,
  subTitle,
  img,
  onPress,
  onClosePress,
}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.PRIMARY_COVER,
      }}>
      <View
        style={{
          backgroundColor: color.WHITE,
          // height: hp(45),
          padding: fp(2),
          borderRadius: fp(2),
          width: wp(85),
          alignItems: 'center',
        }}>
        {/* <View style={{flexDirection: 'row'}}> */}
        <Pressable
          style={{position: 'absolute', top: hp(1), right: wp(2)}}
          onPress={onClosePress}>
          {useIcon.CloseIcon()}
        </Pressable>

        <Image
          source={img}
          resizeMode="cover"
          style={{height: fp(25), width: fp(25), marginTop: hp(2)}}
        />
        <View style={{marginTop: hp(2)}}>
          <CustomText
            bold={true}
            style={{color: color.PRIMARY_BLUE, fontSize: fp(2)}}>
            {title}
          </CustomText>
          <CustomText
            style={{
              fontSize: fp(1.6),
              color: '#727272',
              width: wp(55),
              textAlign: 'center',
              marginTop: hp(0.2),
            }}>
            {subTitle}
          </CustomText>
        </View>

        <ButtonComp title={btnTitle} onPress={onPress} />
      </View>
    </View>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({});
