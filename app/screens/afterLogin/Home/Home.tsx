import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomText from '../../../components/text/CustomText';
import {color} from '../../../constants/colors/colors';

const Home = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <CustomText type={'heading'} style={{color: color.PRIMARY_BLUE}}>
        In development
      </CustomText>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
