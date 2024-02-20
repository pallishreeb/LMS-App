import React from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import your search icon library
import {wp} from '../../helpers/resDimension';

const SearchTextInput = ({value, onChangeText, onSearch}) => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderRadius: 8,
        alignSelf: 'center',
        width: wp(90),
      }}>
      <TextInput
        style={{flex: 1, paddingVertical: 8, paddingRight: 30}} // Adjust padding as needed
        placeholder="Search..."
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity
        onPress={onSearch}
        style={{position: 'absolute', right: 10}}>
        <Icon name="search" size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchTextInput;
