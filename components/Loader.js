import React from 'react';
import { ActivityIndicator, Colors } from 'react-native-paper';
import styled from 'styled-components';
import styles from '../styles';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

export default () => (
  <Container>
    <ActivityIndicator animating={true} color={Colors.red800} />
  </Container>
);
