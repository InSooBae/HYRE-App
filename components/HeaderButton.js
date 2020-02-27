import { Segment, Button, Text } from 'native-base';
import React from 'react';
import styles from '../styles';
import { StyleSheet } from 'react-native';

const HeaderButton = ({ value1, value2, onPress1, onPress2, query }) => {
  const buttonStyle = StyleSheet.create({
    container: {
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: '#d6d7da'
    },
    title: {
      borderRadius: 1,
      borderWidth: 1,
      borderColor: styles.hanyangColor,
      backgroundColor: 'white'
    },
    activeTitle: {
      borderRadius: 1,
      borderWidth: 1,
      borderColor: styles.hanyangColor,
      backgroundColor: styles.hanyangColor
    }
  });
  return (
    <Segment
      style={Platform.OS === 'ios' ? null : { backgroundColor: 'white' }}
    >
      <Button
        style={
          Platform.OS === 'ios'
            ? null
            : query === value1
            ? buttonStyle.activeTitle
            : buttonStyle.title
        }
        first
        active={query === value1 ? true : false}
        onPress={onPress1}
      >
        <Text
          style={
            Platform.OS === 'ios'
              ? null
              : query === value1
              ? { color: 'white' }
              : { color: styles.hanyangColor }
          }
        >
          {value1}
        </Text>
      </Button>
      <Button
        style={
          Platform.OS === 'ios'
            ? null
            : query === value2
            ? buttonStyle.activeTitle
            : buttonStyle.title
        }
        last
        active={query === value2 ? true : false}
        onPress={onPress2}
      >
        <Text
          style={
            Platform.OS === 'ios'
              ? null
              : query === value2
              ? { color: 'white' }
              : { color: styles.hanyangColor }
          }
        >
          {value2}
        </Text>
      </Button>
    </Segment>
  );
};

export default HeaderButton;
