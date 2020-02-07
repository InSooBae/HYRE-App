import React from 'react';
import styled from 'styled-components';
import { TouchableOpacity } from 'react-native-gesture-handler';
import constants from '../../constants';
import AuthButton from '../../components/AuthButton';

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Image = styled.Image`
  width: ${constants.width / 1.2};
  margin-bottom: 150px;
`;

const Touchable = styled.TouchableOpacity``;

const LoginLink = styled.View`
  margin-top: 20px;
  padding: 10px;
  width: ${constants.width / 1.5};
`;
const LoginLinkText = styled.Text`
  color: ${props => props.theme.blueColor};
  font-weight: 600;
  text-align: center;
  font-size: 18px;
`;

export default ({ navigation }) => (
  <View>
    <Image resizeMode={'contain'} source={require('../../assets/HYU2.png')} />
    <AuthButton
      text={'Create New Account'}
      onPress={() => navigation.navigate('SignUp')}
    />
    <Touchable onPress={() => navigation.navigate('Login')}>
      <LoginLink>
        <LoginLinkText>Log in</LoginLinkText>
      </LoginLink>
    </Touchable>
  </View>
);
