import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image, Alert} from 'react-native';
import {ProgressBar} from 'rn-inkpad';
import RNFetchBlob from 'rn-fetch-blob';
import ButtonComp from '../../../components/button/Button';
import Header from '../../../components/header/Header';
import {color} from '../../../constants/colors/colors';
import {fp, hp, wp} from '../../../helpers/resDimension';
import {typography} from '../../../assets/fonts/typography';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PdfBooks = ({navigation, route}) => {
  const {BookDetails} = route.params;

  const [status, setStatus] = useState('download');
  const [progress, setProgress] = useState(0);
  const [filePath, setFilePath] = useState('');
  const [firstTimeChecked, setFirstTimeChecked] = useState(false);

  useEffect(() => {
    checkFileStatus();
    console.log(BookDetails?.pdf_book);
  }, [BookDetails]);

  const checkFileStatus = async () => {
    const pdfUrl = BookDetails?.pdf_book;

    if (!pdfUrl) {
      // Handle the case where pdfUrl is undefined or null
      setStatus('download');
      return;
    }

    const lastIndex = pdfUrl.lastIndexOf('_edited_pdf');
    if (lastIndex === -1) {
      // If '_edited_pdf' is not found in the URL, set status to 'download'
      setStatus('download');
      return;
    }

    const extractedString2 = pdfUrl.substring(lastIndex - 10, lastIndex + 12);
    const fileName = `${extractedString2}.pdf`;
    const cacheDir = RNFetchBlob.fs.dirs.CacheDir;
    const filePath = `${cacheDir}/${fileName}`;

    console.log('🚀 ~ checkFileStatus ~ cacheDir:', cacheDir);
    console.log('🚀 ~ checkFileStatus ~ filePath:', filePath);

    try {
      const fileExists = await RNFetchBlob.fs.exists(filePath);
      console.log('🚀 ~ checkFileStatus ~ fileExists:', fileExists);

      const previousLink = await AsyncStorage.getItem(BookDetails.title);
      console.log('🚀 ~ checkFileStatus ~ previousLink:', previousLink);

      if (fileExists) {
        if (previousLink !== pdfUrl) {
          // If the file exists but the URL has changed, set status to 'update'
          setStatus('update');
        } else {
          // If the file exists and the URL is the same, set status to 'read'
          setStatus('read');
        }
      } else {
        // If the file does not exist, check the previous link
        if (previousLink && previousLink !== pdfUrl) {
          // If the file does not exist and the URL has changed, set status to 'update'
          setStatus('update');
        } else {
          // If the file does not exist and there's no previous link or the URL is the same, set status to 'download'
          setStatus('download');
        }
      }

      // Store the current link in AsyncStorage
      await AsyncStorage.setItem(BookDetails.title, pdfUrl);
      setFilePath(filePath);
    } catch (error) {
      console.error('🚀 ~ checkFileStatus ~ Error:', error);
      setStatus('download');
    }
  };

  const downloadPdf = async () => {
    setStatus('downloading');
    const pdfUrl = BookDetails?.pdf_book;
    // const pdfUrl =
    //   'https://sohojpora.s3.ap-south-1.amazonaws.com/edited_pdf_books/test%20book%20JI_1716532908_edited_pdf.pdf';

    console.log('🚀 ~ downloadPdf ~ pdfUrl:', pdfUrl);
    // const fileName = `${BookDetails?.title}.pdf`;
    // const fileName = BookDetails?.pdf_book;

    const lastIndex = pdfUrl.lastIndexOf('_edited_pdf');
    const extractedString2 = pdfUrl.substring(lastIndex - 10, lastIndex + 12);
    const fileName = `${extractedString2}.pdf`;
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
  // useEffect(() => {
  //   cleanCache();
  // }, []);

  // const cleanCache = async () => {
  //   console.log('clean cache');
  //   const fileName = `${BookDetails?.title}.pdf`;
  //   const cacheDir = RNFetchBlob.fs.dirs.CacheDir;
  //   const filePath = `${cacheDir}/${fileName}`;

  //   try {
  //     const fileExists = await RNFetchBlob.fs.exists(filePath);
  //     if (fileExists) {
  //       await RNFetchBlob.fs.unlink(filePath);
  //       Alert.alert('File deleted', `File at ${filePath} has been deleted.`);
  //       setFilePath('');
  //       setStatus('download');
  //       // setProgress(0);
  //     } else {
  //       Alert.alert('File not found', 'No file found in cache to delete.');
  //     }
  //   } catch (error) {
  //     Alert.alert('Delete error', error.message);
  //   }
  // };

  const handleReadBook = () => {
    if (status === 'download') {
      downloadPdf();
    } else if (status === 'read') {
      navigation.navigate('PdfViewer', {BookDetails: BookDetails});
    } else if (status === 'update') {
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
            // <View style={styles.progressBar}>
            //   <ProgressBar
            //     rounded
            //     value={Number(progress)} // Progress value should be a number
            //     progressColor={color.PRIMARY_BLUE}
            //     textColor={color.WHITE}
            //     showPercent
            //     backgroundColor={color?.PRIMARY_COVER}
            //   />
            // </View>
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
