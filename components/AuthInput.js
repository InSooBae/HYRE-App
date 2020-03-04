import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import constants from '../constants';
import { Item, Toast, Label, Input } from 'native-base';
import { TextInput, HelperText } from 'react-native-paper';
import styles from '../styles';
import { View } from 'react-native';

const Container = styled.View`
  margin-bottom: 10px;
`;

//onChangeText는 callback은 input이 변경될때 호출된다.
//onEndEditing는 textInput이 끝나면 콜백함수로 실행된다
//autoCorrect 는 자동수정기능이다.
//onEndEditing 문제점 발견! 누군가 send를 눌렀는지 아닌지 감지하려는 목적으로 쓰면안됨
// send는 onEndEditing 의 계기가 되지만 input의 바깥에서도 실행되도록 세팅되있음 -> onSubmitEditing 쓸거
const AuthInput = ({
  placeholder,
  value,
  keyboardType = 'default',
  autoCapitalize = 'none',
  onChange,
  returnKeyType = 'done',
  disabled,
  onSubmitEditing = () => null,
  autoCorrect = true,
  style = {
    backgroundColor: 'white',
    fontSize: 16
  },
  visible = false,
  errorMessage,
  infoMessage
}) => {
  return (
    // <Container>
    //   <Item
    //     style={{
    //       width: constants.width / 1.5
    //     }}
    //     floatingLabel
    //     success={focus}
    //   >
    //     <Label>{placeholder}</Label>
    //     <Input
    //       onFocus={() => setFocus(true)}
    //       onBlur={() => setFocus(false)}
    //       onChangeText={onChange}
    //       keyboardType={keyboardType}
    //       returnKeyType={returnKeyType}
    //       value={value}
    //       onSubmitEditing={onSubmitEditing}
    //       autoCorrect={autoCorrect}
    //       autoCapitalize={autoCapitalize}
    //     />
    //   </Item>
    // </Container>
    <View>
      <TextInput
        style={style}
        selectionColor={styles.hanyangColor}
        mode="outlined"
        value={value}
        theme={{
          roundness: 100,
          colors: {
            background: 'white',
            primary: styles.hanyangColor
          }
        }}
        onChangeText={onChange}
        disabled={disabled}
        label={placeholder}
        onSubmitEditing={onSubmitEditing}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        autoCorrect={autoCorrect}
        autoCapitalize={autoCapitalize}
        error={(value.length != 0) !== false && visible}
      />

      {!value && infoMessage && (
        <HelperText type="info" visible={!value}>
          {infoMessage}
        </HelperText>
      )}
      {value.length != 0 && visible && (
        <HelperText type="error" visible={visible}>
          {errorMessage}
        </HelperText>
      )}
    </View>
  );
};

AuthInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  keyboardType: PropTypes.oneOf([
    'default',
    'number-pad',
    'decimal-pad',
    'numeric',
    'numbers-and-punctuation',
    'email-address'
  ]),
  autoCapitalize: PropTypes.oneOf(['none', 'sentences', 'words', 'characters']),
  onChange: PropTypes.func.isRequired,
  returnKeyType: PropTypes.oneOf(['done', 'go', 'next', 'search', 'send']),
  onSubmitEditing: PropTypes.func,
  autoCorrect: PropTypes.bool
};

export default AuthInput;
