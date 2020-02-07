import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import constants from '../constants';

const Container = styled.View`
  margin-bottom: 10px;
`;
const TextInput = styled.TextInput`
  width: ${constants.width / 1.5};
  padding: 15px;
  background-color: ${props => props.theme.greyColor};
  border: 1px solid ${props => props.theme.darkGreyColor};
  border-radius: 4px;
`;

//onChangeText는 callback은 input이 변경될때 호출된다.
const AuthInput = ({
  placeholder,
  value,
  keyboardType = 'default',
  autoCapitalize = 'none',
  onChange
}) => (
  <Container>
    <TextInput
      onChangeText={onChange}
      keyboardType={keyboardType}
      placeholder={placeholder}
      value={value}
      autoCapitalize={autoCapitalize}
    />
  </Container>
);

AuthInput.propTypes = {
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
  onChange: PropTypes.func.isRequired
};

export default AuthInput;
