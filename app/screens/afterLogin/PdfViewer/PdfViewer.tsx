import React, {useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Linking,
  ActivityIndicator,
  Text,
} from 'react-native';
import Pdf from 'react-native-pdf';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';
import {fp, hp, wp} from '../../../helpers/resDimension';
import {createEntityAdapter} from '@reduxjs/toolkit';
import {color} from '../../../constants/colors/colors';
import CustomText from '../../../components/text/CustomText';
import Header from '../../../components/header/Header';
import RNFetchBlob from 'rn-fetch-blob';

const PdfViewer = ({navigation, route}) => {
  const {BookDetails} = route.params;

  // const source = {
  //   uri: `${BookDetails.pdf_book}`,
  //   cache: true,
  // };
  const url = BookDetails?.pdf_book;
  const lastIndex = url.lastIndexOf('_edited_pdf');
  const extractedString2 = url.substring(lastIndex - 10, lastIndex + 12);
  const fileName = `${extractedString2}.pdf`;
  const cacheDir = RNFetchBlob.fs.dirs.CacheDir;
  const filePath = `${cacheDir}/${fileName}`;
  const source = {
    uri: filePath,
    cache: true,
  };

  // const handlePdfLoading = e => {
  //   setIsLoading(true);
  //   setPdfLoadingPercentage(e);
  // };

  return (
    <View style={styles.container}>
      <Pdf
        trustAllCerts={false}
        source={source}
        // onLoadProgress={progress => {
        //   console.log('loading Progress', progress);
        // }}
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
          navigation.navigate('BookVideos', {BookDetails: uri});
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
        // onLoadProgress={handlePdfLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginTop: 25,
    backgroundColor: color.WHITE,
  },
  pdf: {
    flex: 1,

    // width: wp(100),
    // height: hp(100),
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default PdfViewer;
