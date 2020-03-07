import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import constants from '../constants';
import { ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import styles from '../styles';

const Touchable = styled.TouchableOpacity``;
const Container = styled.View`
  background-color: ${props => props.theme.hanyangColor};
  padding: 15px;
  margin: 0px 50px;
  border-radius: 4px;
  width: ${constants.width / 1.5};
`;
const Text = styled.Text`
  color: white;
  text-align: center;
  font-weight: 500;
  font-size: 18px;
`;
//ActivityIndicator = 로딩
const AuthButton = ({
  text,
  onPress,
  loading = false,
  style = { backgroundColor: styles.hanyangColor, padding: 3, marginTop: 20 }
}) => (
  <Button
    style={style}
    loading={loading}
    color="white"
    theme={{
      colors: {
        background: styles.hanyangColor,
        onBackground: styles.hanyangColor
      },
      roundness: 30
    }}
    disabled={loading}
    mode="contained"
    onPress={onPress}
  >
    <Text> {text}</Text>
  </Button>
);

AuthButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default AuthButton;
