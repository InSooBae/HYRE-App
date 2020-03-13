import React from 'react';
import { IconButton } from 'react-native-paper';
import styles from '../styles';
import { withNavigation } from 'react-navigation';

export default withNavigation(({ navigation }) => (
  <IconButton
    icon="magnify"
    size={27}
    color={styles.hanyangColor}
    onPress={() => navigation.navigate('Search')}
  />
));
