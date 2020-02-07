import React, { useState } from 'react';
import styled from 'styled-components';
import { TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import AuthButton from '../../components/AuthButton';
import { LOG_IN, CONFIRM_SECRET } from './AuthQueries';
import AuthInput from '../../components/AuthInput';
import useInput from '../../hooks/useInput';
import { useLogIn } from '../../AuthContext';

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
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
    if (value === '' || !value.includes(' ')) {
      return Alert.alert('Invalid secret');
    }
    try {
      setLoading(true);
      const {
        data: { confirmSecret }
      } = await confirmSecretMutation();
      if (confirmSecret !== '' || confirmSecret !== false) {
        logIn(confirmSecret);
      } else {
        Alert.alert('Wrong Secret!');
      }
    } catch (e) {
      Alert.alert("Can't confirm secret");
    } finally {
      setLoading(false);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <AuthInput
          {...confirmInput}
          placeholder="Secret Key"
          returnKeyType="send"
          onSubmitEditing={handleConfirm}
          autoCorrect={false}
        />
        <AuthButton loading={loading} onPress={handleConfirm} text="Confirm" />
      </View>
    </TouchableWithoutFeedback>
  );
};
