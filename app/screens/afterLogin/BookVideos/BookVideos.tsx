import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  ToastAndroid,
  Alert,
  StatusBar,
  Modal,
} from 'react-native';
import axios from 'axios';
import Video, {OnProgressData} from 'react-native-video';
import Slider from '@react-native-community/slider';
import Orientation from 'react-native-orientation-locker';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {
  CommentDeleteIcon,
  CommentEditIcon,
  CommentMenu,
  DummyProfImg,
  LikeIcon,
  NextIcon,
  OrientationIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  SendComment,
} from '../../../assets/images';
import Header from '../../../components/header/Header';
import {color} from '../../../constants/colors/colors';
import CustomText from '../../../components/text/CustomText';
import {typography} from '../../../assets/fonts/typography';
import {fp, hp, wp} from '../../../helpers/resDimension';
import LikeButton from '../../../components/LikeButton/LikeButton';
import {apiClient} from '../../../helpers/apiClient';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BookVideos: React.FC = ({route}) => {
  const {BookDetails} = route.params;
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showSettings, setShowSettings] = useState(false);
  const videoRef = useRef<Video>(null);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [slideTime, setSlideTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [isVideoPlayerActive, setIsVideoPlayerActive] = useState(false);
  const [commentText, SetCommentText] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [commentsData, setCommentsData] = useState([]);
  const [videoLoading, setVideoLoading] = useState(false);
  const [showCommentMenu, setShowCommentMenu] = useState(false);

  const [bookVideosRes, setBookVideosRes] = useState([]);
  const [likeCount, setLikeCount] = useState();

  const [dislikeCount, setDislikeCount] = useState();
  const [commentCount, setCommentCount] = useState();
  const [openCommentMenuIndex, setOpenCommentMenuIndex] = useState(null);
  const [openCommentReplyMenuIndex, setOpenCommentReplyMenuIndex] =
    useState(null);

  const playbackSpeedOptions = [
    {speed: 0.25, label: '0.25x'},
    {speed: 0.5, label: '0.5x'},
    {speed: 0.75, label: '0.75x'},
    {speed: 1.0, label: 'Normal'},
    {speed: 1.25, label: '1.25x'},
    {speed: 1.5, label: '1.5x'},
    {speed: 1.75, label: '1.75x'},
    {speed: 2.0, label: '2x'},
  ];

  const playNextVideo = () => {
    if (currentVideoIndex < bookVideosRes.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setPaused(false);

      setCommentCount(bookVideosRes[currentVideoIndex + 1].comments_count);
      setLikeCount(bookVideosRes[currentVideoIndex + 1].likes_count);
      setDislikeCount(bookVideosRes[currentVideoIndex + 1].dislikes_count);
      handleGetCommentsData(bookVideosRes[currentVideoIndex + 1].id);
    }
  };

  const onSeekComplete = (value: number) => {
    if (videoRef.current) {
      videoRef.current.seek(value);
      setCurrentTime(value);
      setPaused(false);
    }
  };

  const playPreviousVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      setPaused(false);

      setCommentCount(bookVideosRes[currentVideoIndex - 1].comments_count);
      setLikeCount(bookVideosRes[currentVideoIndex - 1].likes_count);
      setDislikeCount(bookVideosRes[currentVideoIndex - 1].dislikes_count);
      handleGetCommentsData(bookVideosRes[currentVideoIndex - 1].id);
    }
  };

  const togglePlayPause = () => {
    setPaused(!paused);
  };

  const selectPlaybackSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    setShowSettings(false);
  };

  const toggleOrientation = () => {
    if (isLandscape) {
      Orientation.lockToPortrait();
    } else {
      Orientation.lockToLandscape();
    }
    setIsLandscape(!isLandscape);
  };

  const onProgress = (data: OnProgressData) => {
    setCurrentTime(data.currentTime);
    setDuration(data.seekableDuration);
  };

  const onSeek = (value: number) => {
    if (videoRef.current) {
      videoRef.current.seek(value);
      setCurrentTime(value);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    return `${minutes < 10 ? '0' : ''}${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds}`;
  };

  const onLoadStart = () => {
    setIsLoading(true);
  };
  function onReadyForDisplay() {
    setVideoLoading(false);
  }
  function onVideoLoadStart() {
    setVideoLoading(true);
  }
  const onLoad = data => {
    setVideoLoading(false);
    setDuration(data.duration);
  };
  const onError = err => {
    toast(true, 'error: ' + JSON.stringify(err));
  };

  const onVideoBuffer = (param: OnBufferData) => {
    console.log('onVideoBuffer');
    setVideoLoading(param.isBuffering);
  };

  useEffect(() => {
    handleGetBookVideos();
  }, []);

  const handleGetBookVideos = async () => {
    console.log('handleGetBookVideos');
    try {
      setIsLoading(true);
      const response = await apiClient.get(`books/${BookDetails.id}/videos`);
      console.log(response.status, 'response.status');
      if (response.status === 200) {
        setBookVideosRes(response?.data);
        setIsLoading(false);
        setCommentCount(response?.data[currentVideoIndex].comments_count);
        setLikeCount(response?.data[currentVideoIndex].likes_count);
        setDislikeCount(response?.data[currentVideoIndex].dislikes_count);
        handleGetCommentsData(response?.data[currentVideoIndex].id);
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
  function handleCommentMenu(commentId) {
    console.log('🚀 ~ handleCommentMenu ~ commentId:', commentId);
    console.log('handleCommentMenu working');
    setOpenCommentMenuIndex(
      commentId === openCommentMenuIndex ? null : commentId,
    );
  }
  function handleCommentReplyMenu(commentId) {
    console.log('🚀 ~ handleCommentMenu ~ commentId:', commentId);
    console.log('handleCommentMenu working');
    setOpenCommentReplyMenuIndex(
      commentId === openCommentReplyMenuIndex ? null : commentId,
    );
  }

  function handleCommentLike() {
    console.log('handleCommentLike');
  }
  function handleCommentDislike() {
    console.log('handleCommentDislike');
  }
  function handleCommentReply() {
    console.log('handleCommentReply');
  }

  async function handleLikePress() {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('🚀 ~ handleLikePress ~ token:', token);
      setIsLoading(true);
      const response = await axios.post(
        `http://15.206.125.16/api/videos/${bookVideosRes[currentVideoIndex].id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.status, 'response.status');
      if (response.status === 200) {
        console.log(
          '🚀 ~ handleGetBookVideos ~ response?.data:',
          response?.data,
        );
        handleGetBookVideos();
        setIsLoading(false);
      }
    } catch (error) {
      console.log('inside catch', error?.message);
      Snackbar.show({
        text: response?.data?.message,
        duration: 2000,
        backgroundColor: color.RED,
      });
    } finally {
      setIsLoading(false);
    }
  }
  async function handleCommentPress() {}
  async function handleDislikePress() {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('🚀 ~ handleLikePress ~ token:', token);
      setIsLoading(true);
      const response = await axios.post(
        `http://15.206.125.16/api/videos/${bookVideosRes[currentVideoIndex].id}/dislike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.status, 'response.status');
      if (response.status === 200) {
        console.log(
          '🚀 ~ handleGetBookVideos ~ response?.data:',
          response?.data,
        );
        handleGetBookVideos();
        setIsLoading(false);
      }
    } catch (error) {
      console.log('inside catch', error?.message);
      Snackbar.show({
        text: response?.data?.message,
        duration: 2000,
        backgroundColor: color.RED,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSendComment() {
    SetCommentText('');
    const formData = new FormData();
    formData.append('content', commentText);
    try {
      const token = await AsyncStorage.getItem('token');
      setIsLoading(true);
      const response = await axios.post(
        `http://15.206.125.16/api/videos/${bookVideosRes[currentVideoIndex].id}/comments`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      console.log(response.status, 'response.status');
      if (response.status === 201) {
        handleGetCommentsData(bookVideosRes[currentVideoIndex].id);
        setIsLoading(false);
        SetCommentText('');
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
  }

  function onChangeComment(val) {
    SetCommentText(val);
  }

  async function handleGetCommentsData(id) {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `http://15.206.125.16/api/videos/${id}/comments-replies`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.status, 'response.status');
      if (response.status === 200) {
        console.log(
          '🚀 ~ handleGetCommentsData ~ response?.data:',
          response?.data,
        );
        setCommentsData(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log('handleGetCommentsData', error?.message);
      Snackbar.show({
        text: response?.data?.message,
        duration: 2000,
        backgroundColor: color.RED,
      });
      // }
    } finally {
      setIsLoading(false);
    }
  }

  function renderCommentReply({item}) {
    return (
      <View
        style={{
          marginHorizontal: wp(2),
          flexDirection: 'row',
          width: wp(20),
        }}>
        <Image
          source={DummyProfImg}
          style={{height: fp(6), width: fp(6), marginTop: hp(2)}}
          resizeMode="contain"
        />
        <View style={{marginLeft: wp(1.6), marginTop: hp(2)}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: fp(1.4),
              justifyContent: 'space-between',
            }}>
            <CustomText
              type={'typeRegular'}
              style={{
                fontFamily: typography.Inter_Bold,
                fontSize: fp(1.5),
                color: '#565555',
              }}>
              SohibMirza
              <CustomText
                type={'typeRegular'}
                style={{
                  fontFamily: typography.Inter_Medium,
                  fontSize: fp(1.4),
                  color: '#9E9E9E',
                }}>
                {'    '}5 months ago
              </CustomText>
            </CustomText>
            {openCommentReplyMenuIndex === item?.id && (
              <View
                style={{
                  position: 'absolute',
                  // height: hp(4),
                  width: wp(25),
                  backgroundColor: '#Ffffff',
                  // marginLeft: wp(10),
                  elevation: 2,
                  borderRadius: fp(1),
                  right: 10,
                  top: 20,
                  // padding: fp(1),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 5,
                  }}>
                  <Image
                    source={CommentEditIcon}
                    style={{
                      height: fp(1.4),
                      width: fp(1.4),
                      marginLeft: wp(2),
                    }}
                  />
                  <CustomText
                    type={'typeRegular'}
                    style={{
                      fontFamily: typography.Inter_Medium,
                      fontSize: fp(1.4),
                      color: '#565555',
                    }}>
                    {'   '}Edit
                  </CustomText>
                </View>
                <View
                  style={{
                    borderTopColor: '#F2F2F2',
                    borderTopWidth: fp(0.2),
                    width: '100%',
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 5,
                  }}>
                  <Image
                    source={CommentDeleteIcon}
                    style={{
                      height: fp(1.4),
                      width: fp(1.4),
                      marginLeft: wp(2),
                    }}
                    resizeMode="contain"
                  />
                  <CustomText
                    type={'typeRegular'}
                    style={{
                      fontFamily: typography.Inter_Medium,
                      fontSize: fp(1.4),
                      color: '#565555',
                    }}>
                    {'   '}Delete
                  </CustomText>
                </View>
              </View>
            )}
            <Pressable
              style={{height: fp(2), width: fp(2)}}
              onPress={() => {
                handleCommentReplyMenu(item?.id);
              }}>
              <Image
                source={CommentMenu}
                style={{
                  height: fp(2),
                  width: fp(2),
                  marginTop: hp(0.2),
                  alignSelf: 'flex-end',
                }}
                resizeMode="contain"
              />
            </Pressable>
          </View>
          <CustomText
            type={'typeRegular'}
            style={{
              fontFamily: typography.Inter_Regular,
              fontSize: fp(1.4),
              color: '#565555',
              width: wp(65),
              marginTop: hp(0.6),
              textAlign: 'justify',
              lineHeight: 15,
            }}>
            {item?.content}
          </CustomText>
          <View style={{marginTop: hp(1), flexDirection: 'row'}}>
            <Pressable onPress={handleCommentReply}>
              <CustomText
                type={'typeRegular'}
                style={{
                  fontFamily: typography.Inter_Medium,
                  fontSize: fp(1.4),
                  color: '#9E9E9E',
                }}>
                Reply
              </CustomText>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  function renderComments({item}) {
    // console.log('🚀 ~ renderComments ~ item:', item);
    return (
      <>
        <View
          style={{
            borderTopWidth: fp(0.5),
            borderColor: '#F7F7F7',
            marginTop: hp(2),
          }}
        />
        <View
          style={{
            marginHorizontal: wp(2),
            flexDirection: 'row',
            width: wp(20),
          }}>
          <Image
            source={DummyProfImg}
            style={{height: fp(6), width: fp(6), marginTop: hp(2)}}
            resizeMode="contain"
          />
          <View style={{marginLeft: wp(1.6), marginTop: hp(2)}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: fp(1.4),
                justifyContent: 'space-between',
              }}>
              <CustomText
                type={'typeRegular'}
                style={{
                  fontFamily: typography.Inter_Bold,
                  fontSize: fp(1.5),
                  color: '#565555',
                }}>
                SohibMirza
                <CustomText
                  type={'typeRegular'}
                  style={{
                    fontFamily: typography.Inter_Medium,
                    fontSize: fp(1.4),
                    color: '#9E9E9E',
                  }}>
                  {'    '}5 months ago
                </CustomText>
              </CustomText>
              {openCommentMenuIndex === item?.id && (
                <View
                  style={{
                    position: 'absolute',
                    // height: hp(4),
                    width: wp(25),
                    backgroundColor: '#Ffffff',
                    // marginLeft: wp(10),
                    elevation: 2,
                    borderRadius: fp(1),
                    right: 10,
                    top: 20,
                    // padding: fp(1),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 5,
                    }}>
                    <Image
                      source={CommentEditIcon}
                      style={{
                        height: fp(1.4),
                        width: fp(1.4),
                        marginLeft: wp(2),
                      }}
                    />
                    <CustomText
                      type={'typeRegular'}
                      style={{
                        fontFamily: typography.Inter_Medium,
                        fontSize: fp(1.4),
                        color: '#565555',
                      }}>
                      {'   '}Edit
                    </CustomText>
                  </View>
                  <View
                    style={{
                      borderTopColor: '#F2F2F2',
                      borderTopWidth: fp(0.2),
                      width: '100%',
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 5,
                    }}>
                    <Image
                      source={CommentDeleteIcon}
                      style={{
                        height: fp(1.4),
                        width: fp(1.4),
                        marginLeft: wp(2),
                      }}
                      resizeMode="contain"
                    />
                    <CustomText
                      type={'typeRegular'}
                      style={{
                        fontFamily: typography.Inter_Medium,
                        fontSize: fp(1.4),
                        color: '#565555',
                      }}>
                      {'   '}Delete
                    </CustomText>
                  </View>
                </View>
              )}
              <Pressable
                style={{height: fp(2), width: fp(2)}}
                onPress={() => {
                  handleCommentMenu(item?.id);
                }}>
                <Image
                  source={CommentMenu}
                  style={{
                    height: fp(2),
                    width: fp(2),
                    marginTop: hp(0.2),
                    alignSelf: 'flex-end',
                  }}
                  resizeMode="contain"
                />
              </Pressable>
            </View>

            <CustomText
              type={'typeRegular'}
              style={{
                fontFamily: typography.Inter_Regular,
                fontSize: fp(1.4),
                color: '#565555',
                width: wp(80),
                marginTop: hp(0.6),
                textAlign: 'justify',
                lineHeight: 15,
              }}>
              {item?.content}
            </CustomText>

            <Pressable onPress={handleCommentReply} style={{marginTop: hp(1)}}>
              <CustomText
                type={'typeRegular'}
                style={{
                  fontFamily: typography.Inter_Medium,
                  fontSize: fp(1.4),
                  color: '#9E9E9E',
                }}>
                Reply
              </CustomText>
            </Pressable>
            <View style={{marginTop: hp(1.4)}}>
              <FlatList data={item.replies} renderItem={renderCommentReply} />
            </View>
          </View>
        </View>
      </>
    );
  }

  const toast = (visible: boolean, message: string) => {
    if (visible) {
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravityAndOffset(
          message,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      } else {
        Alert.alert(message, message);
      }
    }
  };
  return (
    // <>

    <View style={{flex: 1}}>
      {!isLandscape ? (
        <>
          <Header
            title={'About Book'}
            backgroundColor={color.PRIMARY_BLUE}
            font={'regular'}
            leftIconName={'leftArrow'}
          />
        </>
      ) : null}
      <StatusBar
        hidden={!isLandscape ? false : true}
        backgroundColor={color.PRIMARY_BLUE}
        barStyle="light-content"
      />
      {videoLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}>
          <ActivityIndicator size="large" color={color.WHITE} />
        </View>
      ) : (
        <View style={{flex: 1}}>
          {bookVideosRes?.length > 0 ? (
            <TouchableOpacity
              style={{
                width: '100%',
                height: isLandscape ? '100%' : '30%',
              }}
              activeOpacity={1}
              onPress={() => {
                setIsVideoPlayerActive(!isVideoPlayerActive);
              }}>
              <Video
                resizeMode="cover"
                ref={videoRef}
                muted={isMuted}
                repeat
                paused={paused}
                source={{uri: bookVideosRes[currentVideoIndex].video_url}}
                style={[
                  isLandscape ? styles.video_horizontal : styles.video_vertical,
                ]}
                rate={playbackSpeed}
                onProgress={onProgress}
                onLoadStart={onLoadStart}
                onVideoLoadStart={onVideoLoadStart}
                onError={onError}
                onBuffer={onVideoBuffer}
                onReadyForDisplay={onReadyForDisplay}
                onLoad={onLoad}></Video>

              {isVideoPlayerActive && (
                <TouchableOpacity
                  onPress={() => {
                    setIsVideoPlayerActive(!isVideoPlayerActive);
                  }}
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                  }}>
                  {/* <TouchableOpacity
                style={{
                  top: responsiveHeight(2),
                  left: '90%',
                  // alignSelf:"center"
                }}
                onPress={() => {
                  setShowSettings(!showSettings);
                }}>
                <Image source={settings_img} style={styles.big_imgs_style} />
              </TouchableOpacity> */}
                  {isVideoPlayerActive && (
                    <View
                      style={
                        isLandscape
                          ? styles.big_btns_flex_ver
                          : styles.big_btns_flex_hor
                      }>
                      <TouchableOpacity onPress={playPreviousVideo}>
                        <Image
                          source={PrevIcon}
                          style={styles.big_imgs_style}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                          togglePlayPause();
                        }}>
                        <Image
                          source={paused ? PauseIcon : PlayIcon}
                          style={[styles.big_imgs_style, {tintColor: 'white'}]}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          playNextVideo();
                        }}>
                        <Image
                          source={NextIcon}
                          style={styles.big_imgs_style}
                        />
                      </TouchableOpacity>
                    </View>
                  )}

                  {isVideoPlayerActive && (
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={duration}
                      value={currentTime}
                      minimumTrackTintColor="blue"
                      maximumTrackTintColor="#ffff"
                      thumbTintColor="blue"
                      onValueChange={onSeek}
                      onSlidingComplete={onSeekComplete}
                    />
                  )}

                  <View style={styles.bottom_things_con}>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: isLandscape
                          ? responsiveHeight(3)
                          : responsiveHeight(2.7),
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity onPress={playPreviousVideo}>
                        <Image
                          source={PrevIcon}
                          style={styles.small_imgs_style}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={togglePlayPause}>
                        <Image
                          source={paused ? PauseIcon : PlayIcon}
                          style={[
                            styles.small_imgs_style,
                            {tintColor: 'white'},
                          ]}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={playNextVideo}>
                        <Image
                          source={NextIcon}
                          style={styles.small_imgs_style}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.timeContainer}>
                      <Text style={styles.timeText}>
                        {formatTime(currentTime)}
                      </Text>
                      <Text style={styles.timeText}>
                        {formatTime(duration)}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      setIsVideoPlayerActive(true);
                      toggleOrientation();
                    }}
                    style={{
                      position: 'absolute',
                      right: responsiveHeight(2),
                      bottom: responsiveHeight(1.3),
                    }}>
                    <Image
                      source={OrientationIcon}
                      style={styles.small_imgs_style_landscape}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ) : (
            <ActivityIndicator color={'blue'} />
          )}

          <View style={{marginLeft: wp(4)}}>
            <CustomText
              type={'typeRegular'}
              style={{
                fontFamily: typography.Inter_Bold,
                fontSize: fp(2.8),
                color: color.PRIMARY_BLUE,
                marginTop: hp(1),
              }}>
              Software Engineering
            </CustomText>
          </View>
          <View style={styles.likeButtonContainer}>
            <LikeButton
              imgName={'like'}
              count={likeCount}
              onPress={handleLikePress}
            />
            <LikeButton
              imgName={'comment'}
              count={commentCount}
              onPress={handleCommentPress}
            />
            <LikeButton
              imgName={'dislike'}
              count={dislikeCount}
              onPress={handleDislikePress}
            />
          </View>
          <View>
            <View
              style={{
                borderWidth: fp(0.1),
                borderColor: '#F7F7F7',
                marginTop: hp(2),
              }}
            />
            <View
              style={{
                marginHorizontal: wp(3),
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={DummyProfImg}
                style={{height: fp(6), width: fp(6), marginTop: hp(2)}}
                resizeMode="contain"
              />
              <View
                style={{
                  width: wp(75),
                  backgroundColor: '#F7F7F7',
                  // height: fp(5),
                  marginTop: fp(1.5),
                  borderRadius: fp(5),
                  marginLeft: wp(4),
                  padding: fp(0.3),
                }}>
                <TextInput
                  placeholder="Leave the comment"
                  placeholderTextColor="#878787"
                  style={{
                    color: '#878787',
                    width: wp(65),
                  }}
                  value={commentText}
                  onChangeText={onChangeComment}
                />
              </View>

              <TouchableOpacity
                style={{
                  marginTop: hp(2),
                  position: 'absolute',
                  right: wp(6),
                  top: hp(1.4),
                }}
                onPress={handleSendComment}>
                <Image
                  source={SendComment}
                  style={{
                    height: fp(2.5),
                    width: fp(2.5),
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* //?comment section */}
          <View style={{flex: 1, marginBottom: hp(2)}}>
            <FlatList data={commentsData} renderItem={renderComments} />
          </View>
        </View>
      )}

      {/* {isLoading && (
          <ActivityIndicator
            size="large"
            color="blue"
            style={styles.loadingIndicator}
          />
        )} */}
      {/* USE IT FOR MUTE/UNMUTE THE VIDEO */}
      {/* {isVideoPlayerActive && (
          <Text onPress={() => toggleMute()}>
            {isMuted ? 'Unmute' : 'Mute'}
          </Text>
        )} */}

      {showSettings && (
        <View
          style={
            !isLandscape
              ? styles.modal_container_vertical
              : styles.modal_container_horizontal
          }>
          <FlatList
            data={playbackSpeedOptions}
            renderItem={({item}) => (
              <TouchableOpacity
                style={
                  isLandscape
                    ? styles.speed_option_vertical
                    : styles.speed_option_horizontal
                }
                onPress={() => selectPlaybackSpeed(item.speed)}>
                <Text
                  style={
                    isLandscape
                      ? styles.speed_option_vert
                      : styles.speed_option_text_hori
                  }>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.speed.toString()}
          />
        </View>
      )}
    </View>
    // </>
  );
};

const styles = StyleSheet.create({
  container: {},
  video_vertical: {
    width: '100%',
    height: '100%',
  },
  video_horizontal: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  modal_container_vertical: {
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: responsiveHeight(2),
    right: responsiveHeight(7),
    borderRadius: responsiveHeight(0.2),
    width: responsiveHeight(9),
  },
  modal_container_horizontal: {
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: responsiveHeight(5),
    right: responsiveHeight(25),
    borderRadius: responsiveHeight(0.2),
    width: responsiveHeight(17),
  },
  speed_option_vertical: {
    padding: responsiveHeight(1),
    alignSelf: 'center',
  },

  speed_option_horizontal: {
    padding: responsiveHeight(0.4),
    alignSelf: 'center',
  },
  speed_option_vert: {
    color: '#ffffff',
    fontSize: responsiveHeight(3),
  },
  speed_option_text_hori: {
    color: '#ffffff',
    fontSize: responsiveHeight(1.3),
  },
  speed_option_hori: {
    color: '#ffffff',
    fontSize: responsiveHeight(1.4),
  },
  slider: {
    width: '100%',
    bottom: '15%',
    position: 'absolute',
  },
  timeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: responsiveHeight(1),
    width: '100%',
  },
  timeText: {
    color: '#ffffff',
    fontSize: responsiveFontSize(1.5),
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 999,
  },
  big_imgs_style: {
    // aspectRatio: 1,
    resizeMode: 'contain',
    height: fp(6),
    width: fp(3),
    // height: '30%',
  },
  small_imgs_style: {
    aspectRatio: 1,
    resizeMode: 'contain',
    height: responsiveHeight(1.8),
  },
  big_btns_flex_ver: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: responsiveHeight(15),
    position: 'absolute',
    alignSelf: 'center',
    top: '35%',
  },
  big_btns_flex_hor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: responsiveHeight(7.5),
    position: 'absolute',
    alignSelf: 'center',
    top: '35%',
  },
  bottom_things_con: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    bottom: '4%',
    left: '5%',
    gap: responsiveHeight(1),
  },
  small_imgs_style_landscape: {
    aspectRatio: 1,
    resizeMode: 'contain',
    height: responsiveHeight(1.8),
  },
  likeButtonContainer: {
    flexDirection: 'row',
    marginHorizontal: wp(2),
    justifyContent: 'flex-start',
    gap: fp(0.8),
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default BookVideos;
