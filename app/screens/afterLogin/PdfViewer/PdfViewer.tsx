import React, {useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Linking,
  ActivityIndicator,
} from 'react-native';
import Pdf from 'react-native-pdf';

const PdfViewer = ({navigation, route}) => {
  const {BookDetails} = route.params;
  // const source = {
  //   uri: `${BASE_URL}pdf-url/${2}`,
  //   cache: true,
  // };
  const [loadingPercent, setLoadingPercent] = useState(0);
  const source = {
    uri: `${BookDetails.pdf_book}`,
    cache: true,
  };

  const handlePdfLoading = e => {
    setLoadingPercent(e);
    console.log('🚀 ~ handlePdfLoading ~ e:', e);
    console.log('🚀 ~ handlePdfLoading ~ e:', typeof e);
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
          // Linking.openURL(`${uri}`);
          navigation.navigate('BookVideos', {BookDetails: uri});
          // navigation.navigate('BookVideos', {BookDetails: uri});
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
        onLoadProgress={e => handlePdfLoading(e)}
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
