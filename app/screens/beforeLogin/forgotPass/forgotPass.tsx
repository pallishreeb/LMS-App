import {Image, Pressable, StatusBar, View, Text} from 'react-native';
import React, {useState} from 'react';
import {fp, hp} from '../../../helpers/resDimension';
import {color} from '../../../constants/colors/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MainButton from '../../../components/button/MainButton';
import {Input} from '../../../components/input/Input';
import CustomText from '../../../components/text/CustomText';
import {styles} from './styles';
import {login_illustration} from '../../../assets/images/index';

const ForgotPass = () => {
  const handleEmail = () => {
    console.log('email input active');
  };

  const handleResetPassword = () => {
    console.log('Reset password pressed');
  };
  return (
    <KeyboardAwareScrollView style={styles.mainContainer}>
      <StatusBar backgroundColor={color.WHITE} barStyle="light-content" />
      <View style={styles.illustrationContainer}>
        <Image source={login_illustration} style={styles.illustrationImg} />
      </View>
      <View style={styles.headingContainer}>
        <CustomText type={'heading'}>Forgot Password</CustomText>
        <CustomText type={'textRegular'} style={{marginTop: fp(1)}}>
          Please enter your associated email address.
        </CustomText>
      </View>
      <View>
        <Input
          isLeftIcon={true}
          leftIconName="email"
          placeholder="Enter your email address"
          onChangeText={handleEmail}
        />
      </View>
      <View style={styles.btnContainer}>
        <MainButton _onPress={handleResetPassword} _title="Reset Password" />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ForgotPass;
