import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomText from '../../../components/text/CustomText';
import {color} from '../../../constants/colors/colors';
import Card from '../../../components/bookCard/BookCard';
import {fp, hp, wp} from '../../../helpers/resDimension';
import Header from '../../../components/header/Header';
import {
  BookCoverImg,
  CourseCoverImg,
  dummyRecommend,
  headerBg,
} from '../../../assets/images';
import SearchTextInput from '../../../components/searchTextInput/SearchTextInput';
import RecommendedList from '../../../components/recommededList/RecommendedList';
import BookCard from '../../../components/bookCard/BookCard';
import {typography} from '../../../assets/fonts/typography';
import CourseCard from '../../../components/courseCard/CourseCard';
import {apiClient} from '../../../helpers/apiClient';
import {endpoints} from '../../../constants/colors/endpoints';
import Snackbar from 'react-native-snackbar';
import {FlatList} from 'react-native-gesture-handler';

const Home = ({navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bookDetails, setBookDetails] = useState([]);
  const [courseDetails, setCourseDetails] = useState([]);
  const handleSearch = () => {
    // Perform search functionality here
    console.log('Searching for:', searchText);
  };
  useEffect(() => {
    handleGetBooks();
    handleGetCourses();
  }, []);

  const handleGetBooks = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`${endpoints.GET_BOOKS}`);
      console.log(response.status, 'response.status');
      if (response.status === 200) {
        setBookDetails(response?.data?.books);
        setIsLoading(false);
      }
    } catch (error) {
      console.log('inside catch', error?.message);
      Snackbar.show({
        text: response?.data?.message,
        duration: 2000,
        backgroundColor: color.RED,
      });
      // }
    } finally {
      setIsLoading(false);
    }
  };
  const handleGetCourses = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`${endpoints.GET_COURSES}`);
      console.log(response.status, 'response.status');
      if (response.status === 200) {
        setCourseDetails(response?.data?.courses);
        setIsLoading(false);
      }
    } catch (error) {
      console.log('inside catch', error?.message);
      Snackbar.show({
        text: response?.data?.message,
        duration: 2000,
        backgroundColor: color.RED,
      });
      // }
    } finally {
      setIsLoading(false);
    }
  };

  const recommendImgList = [
    dummyRecommend,
    dummyRecommend,
    dummyRecommend,
    dummyRecommend,
    dummyRecommend,
    dummyRecommend,
  ];

  const renderBooks = ({item}) => {
    return (
      <Pressable
        onPress={() => navigation.navigate('BookDetails', {BookDetails: item})}>
        <View
          style={{
            backgroundColor: color.WHITE,
            height: hp(30.5),
            width: wp(42),
            borderRadius: fp(1),
            marginRight: wp(3),
          }}>
          <Image
            source={{
              uri: `http://15.206.125.16/book_covers/${item.cover_pic}`,
            }}
            style={{
              height: hp(22),
              width: wp(35),
              marginTop: hp(0.5),
              borderRadius: fp(1),
              alignSelf: 'center',
            }}
          />
          <View style={{marginLeft: wp(1)}}>
            <CustomText
              type={'textRegular'}
              style={{
                fontFamily: typography.Inter_Medium,
                fontSize: fp(1.4),
                color: '#333333',
                marginTop: hp(0.5),
              }}>
              {item.title}
            </CustomText>
            {/* {showAuthor && ( */}
            <CustomText
              type={'textRegular'}
              style={{
                fontFamily: typography.Inter_Medium,
                color: '#A0A0A0',
                fontSize: fp(1.2),
                marginLeft: wp(0.5),
              }}>
              Author: Mia shazad
            </CustomText>
            {/* )} */}
            <CustomText
              type={'textRegular'}
              style={{
                fontFamily: typography.Inter_SemiBold,
                color: color.PRIMARY_BLUE,
                marginTop: hp(0.5),
                fontSize: fp(1.65),
              }}>
              ৳ {item?.price}
            </CustomText>
          </View>
        </View>
      </Pressable>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: color.WHITE}}>
      <StatusBar
        backgroundColor={color.PRIMARY_BLUE}
        barStyle="light-content"
      />
      <Image
        source={headerBg}
        style={{height: hp(21), width: wp(100)}}
        resizeMode="cover"
      />
      <View style={{position: 'absolute'}}>
        <Header title={'SOHOJ PORA'} />
        <View
          style={{
            borderTopWidth: fp(0.2),
            borderColor: color.WHITE,
            marginBottom: hp(2),
          }}></View>
        <CustomText
          type="heading"
          style={{marginLeft: wp(5), fontSize: fp(1.7), marginBottom: hp(2)}}>
          Find a course want to learn
        </CustomText>
        <SearchTextInput
          value={searchText}
          onChangeText={setSearchText}
          onSearch={handleSearch}
        />
      </View>
      <View style={{marginTop: hp(2)}}>
        <RecommendedList recommendData={recommendImgList} />
      </View>
      <ScrollView>
        <View
          style={{
            backgroundColor: color.DIM_WHITE,
            height: hp(80),
            borderTopLeftRadius: fp(2),
            borderTopRightRadius: fp(2),
            marginTop: hp(3),
          }}>
          <View
            style={{
              marginHorizontal: wp(5),
              marginTop: hp(2),
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontFamily: typography.Inter_SemiBold,
                color: color.DIM_BLACK,
              }}>
              Class 1
            </Text>

            <Pressable
              onPress={() => {
                navigation.navigate('Books');
              }}>
              <Text
                style={{
                  fontFamily: typography.Inter_SemiBold,
                  color: color.PRIMARY_BLUE,
                  textDecorationLine: 'underline',
                }}>
                See All
              </Text>
            </Pressable>
          </View>
          <View style={{marginTop: hp(1), marginHorizontal: wp(5)}}>
            <FlatList
              data={bookDetails}
              renderItem={renderBooks}
              horizontal
              scrollEnabled={false}
            />
          </View>
          <View
            style={{
              marginHorizontal: wp(5),
              marginTop: hp(2),
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontFamily: typography.Inter_SemiBold,
                  color: color.DIM_BLACK,
                }}>
                Popular Course
              </Text>

              <Pressable>
                <Text
                  style={{
                    fontFamily: typography.Inter_SemiBold,
                    color: color.PRIMARY_BLUE,
                    textDecorationLine: 'underline',
                  }}>
                  See All
                </Text>
              </Pressable>
            </View>
            <View style={{marginTop: hp(2)}}>
              <Pressable onPress={() => console.log('course Card pressed')}>
                <CourseCard courseDetails={courseDetails} />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
