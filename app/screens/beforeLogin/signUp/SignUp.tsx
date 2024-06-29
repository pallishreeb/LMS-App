import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  StatusBar,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {login_illustration} from '../../../assets/images';
import {fp, hp, wp} from '../../../helpers/resDimension';
import {color} from '../../../constants/colors/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MainButton from '../../../components/button/MainButton';
import {Input} from '../../../components/input/Input';
import CustomText from '../../../components/text/CustomText';
import {styles} from './styles';
import {getAndroidId} from 'react-native-device-info';
import {loadString, saveString} from '../../../storage/storage';
import axios from 'axios';
import {endpoints} from '../../../constants/colors/endpoints';
import {apiClient} from '../../../helpers/apiClient';
import ErrorMsg from '../../../components/errorMsg/ErrorMsg';
import {regex} from '../../../constants/regex';
import {useIcon} from '../../../assets/icons/useIcon';

const SignUp = ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [res, setRes] = useState({});
  const [androidDeviceId, setAndroidDeviceId] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameErrorMsg, setNameErrorMsg] = useState('');
  const [emailErrorMsg, setEmailErrorMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
  const [phomeNoErrorMsg, setPhomeNoErrorMsg] = useState('');
  const [confirmPassErrorMsg, setConfirmPassErrorMsg] = useState('');
  const [checkboxState, setCheckboxState] = useState(false);
  const handleLogin = () => {
    navigation.navigate('Login');
  };
  useEffect(() => {
    getAndroidDeviceId();
  }, []);

  const getAndroidDeviceId = () => {
    getAndroidId().then(androidId => {
      setAndroidDeviceId(androidId);
      // androidId here
      // console.log('🚀 ~ getAndroidId ~ androidId:', typeof androidId);
    });
  };

  const handleUserName = (text: string) => {
    setUserName(text);
    // if (!/^[a-zA-Z]+$/g.test(text)) {
    //   setNameErrorMsg('Enter valid name');
    // }
  };
  // const handlePhoneNo = (text: string) => setPhoneNo(text);

  const handleEmail = (text: React.SetStateAction<string>) => {
    const trimmedText = text.trim().replace(/\s/g, '');
    setEmail(trimmedText);
    setEmailErrorMsg(
      trimmedText === ''
        ? 'Email is required'
        : !regex.EMAIL.test(trimmedText)
        ? 'Email is invalid'
        : '',
    );
  };
  const handlePhoneNo = (text: React.SetStateAction<string>) => {
    const trimmedText = text.trim().replace(/\s/g, '');
    setPhoneNo(trimmedText);
    setPhomeNoErrorMsg(
      trimmedText === ''
        ? 'Mobile number is required'
        : !regex.MOBILE.test(trimmedText)
        ? 'Mobile number is invalid'
        : '',
    );
  };
  const handlePassword = (text: React.SetStateAction<string>) => {
    setPassword(text);
    validatePassword(text);
  };
  const handleConfirmPassword = (text: string) => {
    if (text != password) {
      setConfirmPassErrorMsg('Confirm password should match password');
    } else {
      setConfirmPassErrorMsg('');
      setConfirmPassword(text);
    }
  };
  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const validatePassword = password => {
    if (!password) {
      setPasswordErrorMsg('Password is required');
    } else if (password.length < 10) {
      setPasswordErrorMsg('Password should be atleast 10 characters long');
    } else if (!password.match(/[a-z]/)) {
      setPasswordErrorMsg(
        'Password should contain at least one lowercase letter',
      );
    } else if (!password.match(/[A-Z]/)) {
      setPasswordErrorMsg(
        'Password should contain at least one uppercase letter',
      );
    } else if (password.match(/\s/)) {
      setPasswordErrorMsg('Password should not contain any spaces');
    } else if (!password.match(/.*[!@#$%^&*(),.?":{}|<>].*/)) {
      setPasswordErrorMsg('Password should contain special characters');
    } else if (!password.match(/\d/)) {
      setPasswordErrorMsg('Password should contain atleast one number.');
    } else if (!password.match(regex.PASSWORD)) {
      setPasswordErrorMsg('Password is invalid');
    } else {
      setPasswordErrorMsg('');
    }
  };

  const handleSignUp = async () => {
    if (checkboxState === true) {
      saveString('email_for_remember_me', email);
      saveString('password_for_remember_me', password);
    }

    try {
      setIsLoading(true);
      const response = await apiClient.post(`${endpoints.SIGN_UP}`, {
        name: userName,
        email: email,
        mobile_number: phoneNo,
        password: confirmPassword,
        device_id: androidDeviceId,
      });
      // console.log(response.status, 'response.status');
      if (response.status === 200) {
        console.log(response?.data, 'signUp Response');
        setRes(response.data);
        Alert.alert('Info', `${response.data.message}`, [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('Otp', {
                email: email,
                phoneNo: phoneNo,
                previousRoute: 'signup',
              }),
          },
        ]);
      }
    } catch (error) {
      console.log('inside catch', error.message);
      // if (error.message == 'Request failed with status code 500') {
      Alert.alert(
        'Information',
        `${error?.response?.data?.errors?.email} \nPlease try again later`,
      );
      // Snackbar.show({
      //   text: error?.response?.data?.message,
      //   duration: 4000,
      //   backgroundColor: colors.RED,
      // });
      // }
    } finally {
      setIsLoading(false);
    }
  };
  const handleRememberMe = () => {
    setCheckboxState(!checkboxState);
  };
  return (
    <KeyboardAwareScrollView
      style={styles.mainContainer}
      contentContainerStyle={{paddingBottom: hp(5)}}>
      <StatusBar backgroundColor={color.WHITE} barStyle="light-content" />
      <View style={styles.illustrationContainer}>
        <Image source={login_illustration} style={styles.illustrationImg} />
      </View>
      <View style={styles.headingContainer}>
        <CustomText type={'heading'}>Sign Up</CustomText>
        <CustomText type={'textRegular'}>Please Create New Account</CustomText>
      </View>
      <Input
        isLeftIcon={true}
        leftIconName="UserOutline"
        placeholder="Name"
        onChangeText={handleUserName}
      />
      {/* {nameErrorMsg && <ErrorMsg error={nameErrorMsg} />} */}

      <Input
        isLeftIcon={true}
        leftIconName="phone"
        placeholder="Phone Number"
        onChangeText={handlePhoneNo}
        keyboardType="number-pad"
      />
      {phomeNoErrorMsg && <ErrorMsg error={phomeNoErrorMsg} />}
      <Input
        isLeftIcon={true}
        leftIconName="email"
        placeholder="Email"
        onChangeText={handleEmail}
      />
      {emailErrorMsg && <ErrorMsg error={emailErrorMsg} />}
      <Input
        isLeftIcon={true}
        leftIconName="LockOutline"
        isRightIcon={true}
        rightIconName={'password'}
        placeholder="Password"
        onChangeText={handlePassword}
      />
      {passwordErrorMsg && <ErrorMsg error={passwordErrorMsg} />}
      <Input
        isLeftIcon={true}
        leftIconName="LockOutline"
        isRightIcon={true}
        rightIconName={'password'}
        placeholder="Confirm Password"
        onChangeText={handleConfirmPassword}
      />
      {confirmPassErrorMsg && <ErrorMsg error={confirmPassErrorMsg} />}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: wp(6),
          marginTop: hp(2),
        }}>
        <Pressable
          onPress={() => {
            handleRememberMe();
          }}>
          {checkboxState ? useIcon.FilledCheckbox() : useIcon.BlankCheckbox()}
        </Pressable>

        <CustomText type={'textRegular'}>Remember me</CustomText>
      </View>
      <View style={styles.btnContainer}>
        <MainButton _onPress={handleSignUp} _title="Sign Up" />
      </View>
      <View style={styles.bottomText}>
        <CustomText type={'textRegular'}>Already have an account? </CustomText>
        <CustomText
          type={'textRegular'}
          style={styles.underline}
          onPress={handleLoginPress}>
          Login
        </CustomText>
      </View>
      {/* loading modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLoading}
        onRequestClose={() => console.log('no close allowed')}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}>
          <ActivityIndicator size="large" color={color.WHITE} />
        </View>
      </Modal>
    </KeyboardAwareScrollView>
  );
};

export default SignUp;
