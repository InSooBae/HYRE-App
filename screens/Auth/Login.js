import React from 'react';
import styled from 'styled-components';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import AuthButton from '../../components/AuthButton';
import AuthInput from '../../components/AuthInput';
import useInput from '../../hooks/useInput';
import { Alert } from 'react-native';

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default () => {
  const emailInput = useInput('');
  // 이메일이 유효한지 검증
  const handleLogin = () => {
    const { value } = emailInput;
    //이메일 99.99% 유효성 체크
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value === '') {
      return Alert.alert("Email can't be empty");
    } else if (!value.includes('@') || !value.includes('.')) {
      return Alert.alert('Please Write an Email');
    } else if (!emailRegex.test(value)) {
      return Alert.alert('That email is Invalid');
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <AuthInput
          {...emailInput}
          placeholder="Email"
          keyboardType="email-address"
          returnKeyType="send"
          onEndEditing={handleLogin}
          autoCorrect={false}
        />
        <AuthButton onPress={handleLogin} text={'Log In'} />
      </View>
    </TouchableWithoutFeedback>
  );
};
