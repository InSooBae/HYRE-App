import React from 'react';
import styled from 'styled-components';
import { TouchableOpacity } from 'react-native';
const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

//navigation.navigate('네비게이션 이름') 이름 다르면 못찾음
export default ({ navigation }) => (
  <View>
    <Text>Setting</Text>
    <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
      <Text>Edit Profile</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('SignOut')}>
      <Text>Sign Out</Text>
    </TouchableOpacity>
  </View>
);
