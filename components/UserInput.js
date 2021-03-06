import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import constants from '../constants';

const Container = styled.View``;
const TextInput = styled.TextInput`
  font-size: 16;
`;

//onChangeText는 callback은 input이 변경될때 호출된다.
//onEndEditing는 textInput이 끝나면 콜백함수로 실행된다
//autoCorrect 는 자동수정기능이다.
//onEndEditing 문제점 발견! 누군가 send를 눌렀는지 아닌지 감지하려는 목적으로 쓰면안됨
// send는 onEndEditing 의 계기가 되지만 input의 바깥에서도 실행되도록 세팅되있음 -> onSubmitEditing 쓸거
const UserInput = ({
  placeholder,
  value,
  keyboardType = 'default',
  autoCapitalize = 'none',
  onChange,
  returnKeyType = 'done',
  onSubmitEditing = () => null,
  autoCorrect = true
}) => (
  <TextInput
    onChangeText={onChange}
    keyboardType={keyboardType}
    placeholder={placeholder}
    returnKeyType={returnKeyType}
    value={value}
    onSubmitEditing={onSubmitEditing}
    autoCorrect={autoCorrect}
    autoCapitalize={autoCapitalize}
  />
);

UserInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  keyboardType: PropTypes.oneOf([
    'default',
    'number-pad',
    'decimal-pad',
    'numeric',
    'email-address',
    'phone-add'
  ]),
  autoCapitalize: PropTypes.oneOf(['none', 'sentences', 'words', 'characters']),
  onChangeText: PropTypes.func.isRequired,
  returnKeyType: PropTypes.oneOf(['done', 'go', 'next', 'search', 'send']),
  onSubmitEditing: PropTypes.func,
  autoCorrect: PropTypes.bool
};

export default UserInput;
