import {
  ActivityIndicator,
  Alert,
  Dimensions,
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
import {
  getUniqueId,
  getManufacturer,
  getAndroidId,
} from 'react-native-device-info';
import {apiClient} from '../../../helpers/apiClient';
import {endpoints} from '../../../constants/colors/endpoints';
import {regex} from '../../../constants/regex';
import ErrorMsg from '../../../components/errorMsg/ErrorMsg';
import {useIcon} from '../../../assets/icons/useIcon';
import {loadString, saveString} from '../../../storage/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailErrorMsg, setEmailErrorMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
  const [password, setPassword] = useState('');
  const [androidDeviceId, setAndroidDeviceId] = useState('');
  const [checkboxState, setCheckboxState] = useState(false);

  const [res, setRes] = useState({});

  const getRememberMeCredential = async () => {
    const email = await loadString('email_for_remember_me');
    const password = await loadString('password_for_remember_me');
    if (email != undefined) {
      setCheckboxState(true);
      setEmail(email);
      setPassword(password);
    }
  };

  useEffect(() => {
    Alert.alert(
      'Info',
      `Previously, you chose to save your credentials. Would you like to use the saved credentials this time?`,
      [
        {
          text: 'OK',
          onPress: () => getRememberMeCredential(),
        },
        {
          text: 'Cancel',
          // onPress: () => console.log('pressed cancel'),
        },
      ],
    );
  }, []);

  useEffect(() => {
    getAndroidDeviceId();
  }, []);

  const getAndroidDeviceId = () => {
    getAndroidId().then(androidId => {
      setAndroidDeviceId(androidId);
    });
  };

  const handleEmail = (text: React.SetStateAction<string>) => {
    const trimmedText = text.trim().replace(/\s/g, '');
    setEmail(trimmedText);
    setEmailErrorMsg(
      trimmedText === ''
        ? 'Username is required'
        : !regex.EMAIL.test(trimmedText)
        ? 'Username is invalid'
        : '',
    );
  };
  const handlePassword = (text: React.SetStateAction<string>) => {
    setPassword(text);
    validatePassword(text);
  };
  const handleSignUp = () => navigation.navigate('SignUp');

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

  const handleLogin = async () => {
    try {
      if (checkboxState === true) {
        saveString('email_for_remember_me', email);
        saveString('password_for_remember_me', password);
      }
      setIsLoading(true);
      const response = await apiClient.post(`${endpoints.LOGIN}`, {
        email: email,
        password: password,
        device_id: androidDeviceId,
      });
      console.log(response.status, 'response.status');
      if (response.status === 200) {
        console.log(response?.data);
        setRes(response.data);
        await AsyncStorage.setItem('token', response?.data?.token);
        await AsyncStorage.setItem(
          'user_id',
          response?.data?.data?.id.toString(),
        );
        if (response.data.data.otp == null) {
          Alert.alert('Information', `${response.data.message}`, [
            {
              text: 'Ok',
              onPress: () => navigation.navigate('BottomTab'),
              style: 'default',
            },
          ]);
        } else {
          Alert.alert('Info', `Use ${response.data.data.otp} as your OTP`, [
            {
              text: 'OK',
              onPress: () =>
                navigation.navigate('Otp', {
                  phoneNo: response.data.data.mobile_number,
                  email: response.data.data.email,
                  previousRoute: 'login',
                }),
            },
          ]);
        }

        // Alert.alert('Information', `${response.data.message}`, [
        //   {
        //     text: 'Ok',
        //     onPress: () =>
        //       navigation.navigate('Otp', {
        //         email: email,
        //         phoneNo: phoneNo,
        //         otp: response?.data?.otp,
        //       }),
        //     style: 'default',
        //   },
        // ]);
        // console.log('🚀 ~ file: Flow.tsx:120 ~ Flow ~ token:', token);
      }
    } catch (error) {
      console.log('inside catch', error.message);
      // if (error.message == 'Request failed with status code 500') {
      Alert.alert('Information', `${error?.response?.data?.message}`);
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
    <View style={styles.mainContainer}>
      <KeyboardAwareScrollView>
        <StatusBar backgroundColor={color.WHITE} barStyle="light-content" />
        <View style={styles.illustrationContainer}>
          <Image source={login_illustration} style={styles.illustrationImg} />
        </View>
        <View style={styles.headingContainer}>
          <CustomText type={'heading'}>Login</CustomText>
          <CustomText type={'textRegular'}>
            Please sign in to continue.
          </CustomText>
        </View>
        <Input
          isLeftIcon={true}
          leftIconName="UserOutline"
          isRightIcon={false}
          rightIconName=""
          placeholder="Enter Username"
          onChangeText={handleEmail}
          value={email}
        />
        {emailErrorMsg && <ErrorMsg error={emailErrorMsg} />}
        <Input
          isLeftIcon={true}
          leftIconName="LockOutline"
          isRightIcon={true}
          rightIconName={'password'}
          placeholder="Password"
          onChangeText={handlePassword}
          value={password}
        />
        {passwordErrorMsg && <ErrorMsg error={passwordErrorMsg} />}
        <Pressable
          // hitSlop={fp(1.6)}
          onPress={() => navigation.navigate('ForgotPass')}
          style={styles.forgotTextContainer}>
          <CustomText type={'textRegular'}>Forgot Password?</CustomText>
        </Pressable>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: wp(6),
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
          <MainButton _onPress={handleLogin} _title="Login" />
        </View>
        <View style={styles.bottomText}>
          <CustomText type={'textRegular'}>Don't have an account? </CustomText>
          <CustomText
            type={'textRegular'}
            style={styles.underline}
            onPress={handleSignUp}>
            Sign Up
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
    </View>
  );
};

export default Login;
