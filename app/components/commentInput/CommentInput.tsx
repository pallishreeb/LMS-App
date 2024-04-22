import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  CommentAttachment,
  DummyProfImg,
  SendComment,
} from '../../assets/images';
import {fp, hp, wp} from '../../helpers/resDimension';
import {Image} from 'react-native';

const CommentInput = ({
  refInput,
  commentText,
  onChangeComment,
  handleSendComment,
  handleAddAttachment,
  uri,
  isLandscape,
}) => {
  return (
    <View
      style={{
        marginHorizontal: wp(3),
        flexDirection: 'row',
        alignItems: 'center',
        // flex: 2,
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
          borderRadius: fp(2),
          marginLeft: wp(4),
          padding: fp(0.3),
        }}>
        {uri && (
          <Image
            source={{uri: uri}}
            style={{
              height: fp(10),
              width: fp(10),
              marginTop: hp(2),
              marginLeft: wp(4),
              borderRadius: fp(1),
            }}
            resizeMode="cover"
          />
        )}

        <TextInput
          placeholder="Leave the comment"
          placeholderTextColor="#878787"
          style={{
            color: '#878787',
            width: wp(65),
            marginLeft: wp(4),
          }}
          value={commentText}
          onChangeText={onChangeComment}
          ref={refInput}
        />
      </View>

      <TouchableOpacity
        style={{
          marginTop: hp(2),
          marginLeft: -wp(16),
          marginRight: wp(3),
          // position: 'absolute',
          // right: wp(14),
          // top: hp(1.4),
        }}
        onPress={handleAddAttachment}>
        <Image
          source={CommentAttachment}
          style={{
            height: fp(2.5),
            width: fp(2.5),
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginTop: hp(2),

          // position: 'absolute',
          // right: wp(6),
          // top: hp(1.4),
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
  );
};

export default CommentInput;

const styles = StyleSheet.create({});
