import React, { useState } from 'react';
import styled from 'styled-components';
import {
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import AuthButton from '../../components/AuthButton';
import { CONFIRM_SECRET } from './AuthQueries';
import AuthInput from '../../components/AuthInput';
import useInput from '../../hooks/useInput';
import { useLogIn } from '../../AuthContext';
import constants from '../../constants';
import styles from '../../styles';
import { Toast } from 'native-base';

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: white;
`;

const Text = styled.Text``;

//navigation을 가지고있고
export default ({ navigation }) => {
  const confirmInput = useInput('');
  //logIn 이거 hooks임 in AuthContext.js
  const logIn = useLogIn();
  const [loading, setLoading] = useState(false);
  const [confirmSecretMutation] = useMutation(CONFIRM_SECRET, {
    variables: {
      secret: confirmInput.value,
      //여기서 props로 받은 parameter꺼내서(getParam) 사용가능 키값
      email: navigation.getParam('email')
    }
  });
  const handleConfirm = async () => {
    const { value } = confirmInput;
    if (value === '') {
      return Toast.show({
        text: `Secret Key를 입력해주세요.`,
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
        data: { confirmSecret }
      } = await confirmSecretMutation();
      if (confirmSecret !== '' || confirmSecret !== false) {
        logIn(confirmSecret);
      } else {
        return Toast.show({
          text: `Secret Key가 맞지 않습니다.`,
          textStyle: { textAlign: 'center' },
          buttonText: 'Okay',
          type: 'warning',
          position: 'top',
          duration: 3000,
          style: { marginTop: 70 }
        });
      }
    } catch (e) {
      return Toast.show({
        text: `Secret Key가 맞지 않습니다.`,
        textStyle: { textAlign: 'center' },
        buttonText: 'Okay',
        type: 'warning',
        position: 'top',
        duration: 3000,
        style: { marginTop: 70 }
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          backgroundColor: 'white'
        }}
        behavior="padding"
        enabled
      >
        <AuthInput
          style={{
            backgroundColor: 'white',
            fontSize: 16,
            width: constants.width / 1.5
          }}
          {...confirmInput}
          placeholder="Secret Key"
          returnKeyType="send"
          onSubmitEditing={handleConfirm}
          autoCorrect={false}
          infoMessage="Secret Key를 입력해주세요"
        />
        <AuthButton
          style={{
            fontSize: 16,
            width: constants.width / 1.5,
            backgroundColor: styles.hanyangColor,
            padding: 3,
            marginTop: 20
          }}
          loading={loading}
          onPress={handleConfirm}
          text="Confirm"
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
