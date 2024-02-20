import React from 'react';
import {StyleSheet, Dimensions, View, Linking} from 'react-native';
import Pdf from 'react-native-pdf';
import {BASE_URL} from '../../../constants/storageKeys';

const PdfViewer = ({navigation, route}) => {
  const {BookDetails} = route.params;
  // const source = {
  //   uri: `${BASE_URL}pdf-url/${2}`,
  //   cache: true,
  // };
  const source = {
    uri: `http://15.206.125.16/pdf_books/${BookDetails.pdf_book}`,
    // uri: `http://15.206.125.16/pdf_books/1708345315.pdf`,
    cache: true,
  };

  return (
    <View style={styles.container}>
      <Pdf
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
          Linking.openURL(`${uri}`);
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
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default PdfViewer;
