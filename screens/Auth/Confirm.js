import React, { useState } from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
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
        text: `Verification code를 입력해주세요.`,
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
          text: `Verification code가 맞지 않습니다.`,
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
        text: `Verification code가 맞지 않습니다.`,
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
            width: constants.width / 1.4
          }}
          {...confirmInput}
          placeholder="Verification code"
          returnKeyType="send"
          onSubmitEditing={handleConfirm}
          autoCorrect={false}
          infoMessage="이메일로 발송된 인증코드를 입력해주세요"
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
