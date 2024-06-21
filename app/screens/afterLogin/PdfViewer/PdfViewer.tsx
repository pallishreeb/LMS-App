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
import {color} from '../../../constants/colors/colors';

import RNFetchBlob from 'rn-fetch-blob';

const PdfViewer = ({navigation, route}) => {
  const {BookDetails} = route.params;
  const pdfUrl = BookDetails.pdf_book;
  const fileNameWithExtension = pdfUrl.substring(pdfUrl.lastIndexOf('/') + 1);
  const cacheDir = RNFetchBlob.fs.dirs.CacheDir;
  const filePath = `${cacheDir}/${fileNameWithExtension}`;
  console.log('🚀 ~ PdfViewer ~ BookDetails:', BookDetails);
  // const filePath = `${cacheDir}/${url}`;

  const source = {
    uri: filePath,
    cache: true,
  };

  return (
    <View style={styles.container}>
      <Pdf
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
          navigation.navigate('BookVideos', {
            BookDetails: BookDetails,
            VideoUri: uri,
          });
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
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
