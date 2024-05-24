import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image, Alert} from 'react-native';

import RNFetchBlob from 'rn-fetch-blob';
import ButtonComp from '../../../components/button/Button';
import Header from '../../../components/header/Header';
import {color} from '../../../constants/colors/colors';
import {fp, hp, wp} from '../../../helpers/resDimension';
import {typography} from '../../../assets/fonts/typography';
import Snackbar from 'react-native-snackbar';

const PdfBooks = ({navigation, route}) => {
  const {BookDetails} = route.params;

  const [status, setStatus] = useState('download');
  const [progress, setProgress] = useState(0);
  const [filePath, setFilePath] = useState('');

  const source = {
    uri: `${BookDetails.pdf_book}`,
  };

  useEffect(() => {
    checkFileStatus();
    console.log('BookDetails', BookDetails);
  }, [BookDetails]);

  const checkFileStatus = async () => {
    // const fileName = `${BookDetails?.title}.pdf`;
    const fileName = BookDetails?.pdf_book;
    const cacheDir = RNFetchBlob.fs.dirs.CacheDir;
    const filePath = `${cacheDir}/${fileName}`;

    const fileExists = await RNFetchBlob.fs.exists(filePath);
    if (fileExists) {
      setStatus('read');
      setFilePath(filePath);
    } else {
      // setStatus('download');
      setStatus('update');
    }
  };

  const downloadPdf = async () => {
    setStatus('downloading');
    const pdfUrl = BookDetails?.pdf_book;
    console.log('🚀 ~ downloadPdf ~ pdfUrl:', pdfUrl);
    // const fileName = `${BookDetails?.title}.pdf`;
    const fileName = BookDetails?.pdf_book;
    const cacheDir = RNFetchBlob.fs.dirs.CacheDir;
    const filePath = `${cacheDir}/${fileName}`;

    try {
      // Download the PDF
      let downloadedSize = 0; // Initialize downloaded size to 0

      const res = await RNFetchBlob.config({
        path: filePath,
      })
        .fetch('GET', pdfUrl)
        .progress((received, total) => {
          downloadedSize = received; // Update the downloaded size
          const percentage = Math.min((received / total) * 100); // Calculate progress percentage based on received size
          console.log('🚀 ~ .progress ~ percentage:', percentage);
          setProgress(percentage); // Update progress state
        });

      if (res.info().status === 200) {
        // Alert.alert('Download complete', `File saved to cache at: ${filePath}`);
        Snackbar.show({
          text: 'The file has been successfully downloaded.',
          duration: 2000,
          backgroundColor: color.PRIMARY_BLUE,
        });
        setFilePath(filePath);
        setStatus('read');
      } else {
        Alert.alert('Download failed', `Status code: ${res.info().status}`);
        Snackbar.show({
          text: 'Download failed.',
          duration: 2000,
          backgroundColor: color.RED,
        });
        setStatus('download');
      }
    } catch (error) {
      Alert.alert('Download error', error.message);
      setStatus('download');
    }
  };

  const handleReadBook = () => {
    if (status === 'download') {
      downloadPdf();
    } else if (status === 'read') {
      navigation.navigate('PdfViewer', {BookDetails: BookDetails});
    } else if (status == 'update') {
      downloadPdf();
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={'Books'}
        backgroundColor={color.PRIMARY_BLUE}
        font={'regular'}
        leftIconName={'leftArrow'}
      />
      <View style={styles.bookContainer}>
        <Image
          source={{uri: BookDetails?.cover_pic}}
          style={styles.coverImage}
        />
        <View>
          <Text style={styles.title}>{BookDetails?.title}</Text>
          <Text style={styles.description}>{BookDetails?.description}</Text>
          {status === 'downloading' && (
            <>
              <View style={styles.progressBar}>
                <View style={[styles.progress, {width: `${progress}%`}]} />
              </View>
              <Text style={{color: color.PRIMARY_BLUE, marginLeft: wp(3)}}>
                {progress.toFixed(0)}%
              </Text>
            </>
          )}
          {status !== 'downloading' && (
            <View style={styles.buttonContainer}>
              <ButtonComp
                title={
                  status === 'download'
                    ? 'Download'
                    : status == 'read'
                    ? 'Read Book'
                    : 'Update'
                }
                padding={fp(1)}
                fontSize={fp(1.6)}
                onPress={handleReadBook}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: color.WHITE,
  },
  bookContainer: {
    marginTop: hp(4),
    height: hp(20),
    width: wp(90),
    borderColor: color.PRIMARY_BLUE,
    borderWidth: 1.5,
    borderRadius: fp(1),
    elevation: 5,
    backgroundColor: color.WHITE,
    flexDirection: 'row',
  },
  coverImage: {
    height: fp(18),
    width: fp(16),
    marginLeft: wp(2),
    marginTop: hp(1),
    borderRadius: fp(1),
  },
  title: {
    color: color.DIM_BLACK,
    fontSize: fp(2),
    fontFamily: typography.Inter_Bold,
    marginTop: hp(2.2),
    marginLeft: wp(3),
  },
  description: {
    color: color.DIM_BLACK,
    fontSize: fp(1.8),
    fontFamily: typography.Inter_Bold,
    marginTop: hp(0.5),
    marginLeft: wp(3),
  },
  // progressBar: {
  //   marginTop: hp(1),
  //   marginLeft: wp(3),
  //   width: wp(48),
  // },
  buttonContainer: {
    width: wp(30),
    height: hp(8),
    marginLeft: wp(2),
    position: 'absolute',
    bottom: 0,
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  progressBar: {
    marginTop: hp(1),
    marginLeft: wp(3),
    width: wp(48),
    height: hp(2),
    backgroundColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: color.PRIMARY_BLUE,
  },
});

export default PdfBooks;
