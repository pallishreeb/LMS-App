import {Dimensions, Platform, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BASE_URL} from '../../../constants/storageKeys';
import Pdf from 'react-native-pdf';
const Profile = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>Profile Under development</Text>
      <Text onPress={() => navigation.navigate('Login')}> LOG OUT </Text>
      {/* <Pdf
        trustAllCerts={false}
        source={source}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={error => {
          console.log(error);
        }}
        onPressLink={uri => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
      /> */}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
