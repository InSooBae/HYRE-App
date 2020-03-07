import React, { useState } from 'react';
import styled from 'styled-components';
import {
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal
} from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import AuthButton from '../../components/AuthButton';
import { LOG_IN } from './AuthQueries';
import AuthInput from '../../components/AuthInput';
import useInput from '../../hooks/useInput';
import constants from '../../constants';
import { Toast, Container, View } from 'native-base';

export default ({ navigation }) => {
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 10 : 0;
  const emailInput = useInput(navigation.getParam('email', ''));
  const [loading, setLoading] = useState(false);
  const [requestSecretMutation] = useMutation(LOG_IN, {
    variables: {
      email: emailInput.value
    }
  });
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // 이메일이 유효한지 검증
  const handleLogin = async () => {
    const { value } = emailInput;
    //이메일 99.99% 유효성 체크
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
        //navigate에 parameter보낼수있음 (email state보냄)
        navigation.navigate('Confirm', { email: value });
        return Toast.show({
          text: `이메일을 확인해 주세요.`,
          textStyle: { textAlign: 'center' },
          buttonText: 'Okay',
          type: 'success',
          position: 'top',
          duration: 3000,
          style: { marginTop: 70 }
        });
      } else {
        navigation.navigate('SignUp', { email: value });
        return Toast.show({
          text: `계정이 없거나 관리자 승인되지 않은 계정입니다.`,
          textStyle: { textAlign: 'center' },
          buttonText: 'Okay',
          type: 'danger',
          position: 'top',
          duration: 5000,
          style: { marginTop: 70 }
        });
      }
    } catch (e) {
      Alert.alert("Can't Log In Now!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior="position"
        style={{
          width: constants.width,
          backgroundColor: 'white',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignSelf: 'center',
          alignItems: 'center',

          flex: 1
        }}
        enabled
      >
        <Image
          style={{
            marginTop: 50,
            width: constants.width / 1.5,
            height: constants.height / 5,
            marginBottom: constants.height / 5
          }}
          resizeMode={'contain'}
          source={require('../../assets/HYU1.png')}
        />
        <View style={{ width: constants.width / 1.5 }}>
          <AuthInput
            {...emailInput}
            placeholder="(이메일)*"
            keyboardType="email-address"
            returnKeyType="send"
            onSubmitEditing={handleLogin}
            autoCorrect={false}
            visible={!emailRegex.test(emailInput.value)}
            errorMessage="이메일 형식이 맞지 않습니다"
            infoMessage="이메일을 입력해주세요"
          />
          <AuthButton loading={loading} onPress={handleLogin} text={'Log In'} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
