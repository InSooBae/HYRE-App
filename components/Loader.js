import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components';
import styles from '../styles';
import { Spinner } from 'native-base';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

export default () => (
  <Container>
    <Spinner color={styles.hanyangColor} />
  </Container>
);
