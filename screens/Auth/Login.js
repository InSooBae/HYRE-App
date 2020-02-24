import React, { useState } from 'react';
import styled from 'styled-components';
import {
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
  KeyboardAvoidingView
} from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import AuthButton from '../../components/AuthButton';
import { LOG_IN } from './AuthQueries';
import AuthInput from '../../components/AuthInput';
import useInput from '../../hooks/useInput';
import constants from '../../constants';
import { Toast, Container } from 'native-base';

const View = styled.View`
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  flex: 1;
  background-color: white;
`;

export default ({ navigation }) => {
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 10 : 0;
  const emailInput = useInput(navigation.getParam('email', ''));
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
      return Toast.show({
        text: `이메일을 입력해 주세요.`,
        textStyle: { textAlign: 'center' },
        buttonText: 'Okay',
        type: 'warning',
        position: 'top',
        duration: 3000,
        style: { marginTop: 70 }
      });
    } else if (!emailRegex.test(value)) {
      return Toast.show({
        text: `이메일 형식이 맞지 않습니다.`,
        textStyle: { textAlign: 'center' },
        buttonText: 'Okay',
        type: 'warning',
        position: 'top',
        duration: 3000,
        style: { marginTop: 70 }
      });
    }
    try {
      setLoading(true);
      const {
        data: { requestSecret }
      } = await requestSecretMutation();
      if (requestSecret) {
        Alert.alert('Check Your Email');
        //navigate에 parameter보낼수있음 (email state보냄)
        navigation.navigate('Confirm', { email: value });
        return;
      } else {
        Alert.alert('Account not Found');
        navigation.navigate('SignUp', { email: value });
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
        <Image
          style={{
            marginTop: 50,
            width: constants.width / 2,
            height: constants.height / 5,
            marginBottom: constants.height / 7
          }}
          resizeMode={'contain'}
          source={require('../../assets/HYU1.png')}
        />
        <Container
          style={{
            alignItems: 'center'
          }}
        >
          <AuthInput
            {...emailInput}
            placeholder="이메일"
            keyboardType="email-address"
            returnKeyType="send"
            onSubmitEditing={handleLogin}
            autoCorrect={false}
          />

          <AuthButton loading={loading} onPress={handleLogin} text={'Log In'} />
        </Container>
      </View>
    </TouchableWithoutFeedback>
  );
};
