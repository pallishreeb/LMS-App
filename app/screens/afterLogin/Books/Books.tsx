import {useEffect, useState} from 'react';
import {Image, Pressable, StatusBar, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {typography} from '../../../assets/fonts/typography';
import {BookCoverImg, headerBg} from '../../../assets/images/index';
import Header from '../../../components/header/Header';
import SearchTextInput from '../../../components/searchTextInput/SearchTextInput';
import CustomText from '../../../components/text/CustomText';
import {color} from '../../../constants/colors/colors';
import {fp, hp, wp} from '../../../helpers/resDimension';
import {endpoints} from '../../../constants/colors/endpoints';
import {apiClient} from '../../../helpers/apiClient';
import Snackbar from 'react-native-snackbar';
import {FlatList} from 'react-native-gesture-handler';

const Books = ({navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [bookDetails, setBookDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleSearch = () => {
    // Perform search functionality here
    console.log('Searching for:', searchText);
  };

  const handleGetBooks = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`${endpoints.GET_BOOKS}`);
      console.log(response.status, 'response.status');
      if (response.status === 200) {
        console.log(
          '🚀 ~ handleGetBooks ~ response?.data?.books:',
          response?.data?.books,
        );

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
  useEffect(() => {
    handleGetBooks();
  }, []);

  const renderBooks = ({item}) => {
    return (
      <Pressable
        onPress={() => navigation.navigate('BookDetails', {BookDetails: item})}>
        <View
          style={{
            backgroundColor: color.WHITE,
            height: hp(30.5),
            width: wp(45),
            borderRadius: fp(1),
            marginRight: wp(3),
          }}>
          <Image
            source={{uri: `${item.cover_pic}`}}
            style={{
              height: hp(22),
              width: wp(38),
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
              Author: Sohoj Pora
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
    <View style={{flex: 1}}>
      <KeyboardAwareScrollView>
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
        <View style={{backgroundColor: color.WHITE}}>
          <View
            style={{
              backgroundColor: color.DIM_WHITE,
              height: hp(80),
              borderTopLeftRadius: fp(2),
              borderTopRightRadius: fp(2),
              marginTop: hp(2.4),
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
            </View>
            <View style={{marginTop: hp(1), marginHorizontal: wp(5)}}>
              <FlatList
                data={bookDetails}
                renderItem={renderBooks}
                horizontal
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
                  Class 1-2 Bundle Books
                </Text>
              </View>
              <View style={{marginTop: hp(2)}}>
                {/* <BookCard showAuthor={false} bookDetails={bookDetails} /> */}
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Books;
