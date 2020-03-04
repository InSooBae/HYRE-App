import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import constants from '../constants';
import styles from '../styles';
import { Header, Item, Icon, Input, Button, Text } from 'native-base';
import { Platform, View } from 'react-native';
import { Searchbar } from 'react-native-paper';

const SearchBar = ({ onChange, value, onSubmit }) => (
  <Searchbar
    sel
    selectionColor={styles.hanyangColor}
    style={{
      width: constants.width,
      backgroundColor: styles.greyColor,
      borderColor: styles.hanyangColor,
      borderWidth: 1
    }}
    theme={{
      colors: {
        primary: styles.redColor,
        text: styles.hanyangColor
      },
      roundness: 30
    }}
    placeholder="Search"
    returnKeyType="search"
    onChangeText={onChange}
    onSubmitEditing={onSubmit}
    value={value}
    autoCorrect={false}
    autoCapitalize="none"
  />
);

SearchBar.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default SearchBar;
