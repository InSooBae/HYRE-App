import React, { useState } from 'react';
import styled from 'styled-components';
import { TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import AuthButton from '../../components/AuthButton';
import { LOG_IN } from './AuthQueries';
import AuthInput from '../../components/AuthInput';
import useInput from '../../hooks/useInput';

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default ({ navigation }) => {
  const emailInput = useInput('');
  const [loading, setLoading] = useState(false);
  const [requestSecretMutation] = useMutation(LOG_IN, {
    variables: {
      email: emailInput.value
    }
  });
  // 이메일이 유효한지 검증
  const handleLogin = async () => {
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
    try {
      setLoading(true);
      const {
        data: { requestSecret }
      } = await requestSecretMutation();
      if (requestSecret) {
        Alert.alert('Check Your Email');
        navigation.navigate('Confirm');
        return;
      } else {
        Alert.alert('Account not Found');
        navigation.navigate('SignUp');
      }
    } catch (e) {
      Alert.alert("Can't Log In Now!");
    } finally {
      setLoading(false);
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
          onSubmitEditing={handleLogin}
          autoCorrect={false}
        />
        <AuthButton loading={loading} onPress={handleLogin} text={'Log In'} />
      </View>
    </TouchableWithoutFeedback>
  );
};
