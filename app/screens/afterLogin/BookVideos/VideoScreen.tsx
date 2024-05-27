import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import VideoPlayer from '../../../components/VideoPlayer/VideoPlayer';
import {fp, hp} from '../../../helpers/resDimension';

const VideoScreen = () => {
  return (
    <View style={{backgroundColor: 'red'}}>
      <View style={{height: hp(50), backgroundColor: 'green'}}>
        {/* <VideoPlayer /> */}
      </View>

      <Text style={{fontSize: fp(3), color: 'red'}}>al;ksdfjas;dklf</Text>
    </View>
  );
};

export default VideoScreen;

const styles = StyleSheet.create({});
